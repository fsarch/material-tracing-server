import { vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { ProductServerService } from './product-server.service.js';

describe('ProductServerService', () => {
  let service: ProductServerService;
  const fetchMock = vi.fn();
  let configGetMock: ReturnType<typeof vi.fn>;

  const validConfig = {
    type: 'remote',
    url: 'http://product-server.local',
    catalog_id: 'catalog-id',
    auth: { type: 'credential-propagation' },
  };

  beforeEach(async () => {
    vi.stubGlobal('fetch', fetchMock);
    fetchMock.mockReset();
    configGetMock = vi.fn().mockReturnValue(validConfig);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductServerService,
        {
          provide: ConfigService,
          useValue: { get: configGetMock },
        },
      ],
    }).compile();

    service = module.get<ProductServerService>(ProductServerService);
  });

  const user = {
    getAccessToken: () => 'test-token',
  } as any;

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('isConfigured', () => {
    it('returns false when no product_server config section is present', () => {
      configGetMock.mockReturnValue(undefined);

      expect(service.isConfigured()).toBe(false);
    });

    it('returns true when a product_server config section is present', () => {
      expect(service.isConfigured()).toBe(true);
    });
  });

  describe('validateProductExists', () => {
    it('throws when no product_server config section is present (app runs without product-server)', async () => {
      configGetMock.mockReturnValue(undefined);

      await expect(
        service.validateProductExists('product-id', { user }),
      ).rejects.toThrow('product-server is not configured');

      expect(fetchMock).not.toHaveBeenCalled();
    });

    it('returns true when product-server responds with 200', async () => {
      fetchMock.mockResolvedValue({ status: 200 });

      await expect(
        service.validateProductExists('product-id', { user }),
      ).resolves.toBe(true);

      expect(fetchMock).toHaveBeenCalledWith(
        new URL('http://product-server.local/v1/catalogs/catalog-id/items/product-id'),
        { headers: { Authorization: 'Bearer test-token' } },
      );
    });

    it('returns false when product-server responds with 404', async () => {
      fetchMock.mockResolvedValue({ status: 404 });

      await expect(
        service.validateProductExists('product-id', { user }),
      ).resolves.toBe(false);
    });

    it('throws when product-server responds with an unexpected status', async () => {
      fetchMock.mockResolvedValue({ status: 500 });

      await expect(
        service.validateProductExists('product-id', { user }),
      ).rejects.toThrow();
    });

    it('throws when the config section is present but invalid', async () => {
      configGetMock.mockReturnValue({ type: 'remote' });

      await expect(
        service.validateProductExists('product-id', { user }),
      ).rejects.toThrow('invalid product_server config');
    });
  });

  describe('listItems', () => {
    it('returns an empty list when no product_server config section is present (app runs without product-server)', async () => {
      configGetMock.mockReturnValue(undefined);

      await expect(service.listItems({ user })).resolves.toEqual([]);

      expect(fetchMock).not.toHaveBeenCalled();
    });

    it('returns the mapped item list when product-server responds with 200', async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve([
            { id: 'item-1', name: 'Item 1', irrelevant: 'field' },
            { id: 'item-2', name: 'Item 2' },
          ]),
      });

      await expect(service.listItems({ user })).resolves.toEqual([
        { id: 'item-1', name: 'Item 1' },
        { id: 'item-2', name: 'Item 2' },
      ]);

      expect(fetchMock).toHaveBeenCalledWith(
        new URL('http://product-server.local/v1/catalogs/catalog-id/items'),
        { headers: { Authorization: 'Bearer test-token' } },
      );
    });

    it('throws when product-server responds with an unexpected status', async () => {
      fetchMock.mockResolvedValue({ ok: false, status: 500 });

      await expect(service.listItems({ user })).rejects.toThrow();
    });

    describe('stale-while-revalidate cache', () => {
      const page1 = [{ id: 'item-1', name: 'Item 1' }];
      const page2 = [{ id: 'item-2', name: 'Item 2' }];

      const mockItems = (items: Array<{ id: string; name: string }>) =>
        fetchMock.mockResolvedValue({
          ok: true,
          status: 200,
          json: () => Promise.resolve(items),
        });

      beforeEach(() => {
        vi.useFakeTimers();
      });

      afterEach(() => {
        vi.useRealTimers();
      });

      it('serves cached data without refetching while still fresh', async () => {
        mockItems(page1);

        await expect(service.listItems({ user })).resolves.toEqual(page1);

        mockItems(page2);
        vi.advanceTimersByTime(30_000); // < ITEMS_CACHE_FRESH_MS (60s)

        await expect(service.listItems({ user })).resolves.toEqual(page1);
        expect(fetchMock).toHaveBeenCalledTimes(1);
      });

      it('serves stale data immediately and refreshes in the background', async () => {
        mockItems(page1);

        await expect(service.listItems({ user })).resolves.toEqual(page1);

        mockItems(page2);
        vi.advanceTimersByTime(90_000); // > fresh (60s), < max stale (10m)

        // Stale value is returned right away, without waiting on the refetch.
        await expect(service.listItems({ user })).resolves.toEqual(page1);

        // Let the background refresh (fired but not awaited) settle.
        await vi.waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));

        await expect(service.listItems({ user })).resolves.toEqual(page2);
      });

      it('blocks and refetches once the cache is older than the max stale window', async () => {
        mockItems(page1);

        await expect(service.listItems({ user })).resolves.toEqual(page1);

        mockItems(page2);
        vi.advanceTimersByTime(11 * 60_000); // > ITEMS_CACHE_MAX_STALE_MS (10m)

        await expect(service.listItems({ user })).resolves.toEqual(page2);
        expect(fetchMock).toHaveBeenCalledTimes(2);
      });

      it('dedupes concurrent cold-cache calls into a single upstream request', async () => {
        mockItems(page1);

        const [first, second] = await Promise.all([
          service.listItems({ user }),
          service.listItems({ user }),
        ]);

        expect(first).toEqual(page1);
        expect(second).toEqual(page1);
        expect(fetchMock).toHaveBeenCalledTimes(1);
      });
    });
  });
});
