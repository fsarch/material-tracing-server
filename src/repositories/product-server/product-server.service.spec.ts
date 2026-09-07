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
});
