import { Test } from '@nestjs/testing';
import { CustomResourcesModule } from './custom-resources.module.js';
import { CustomResourcesService } from './custom-resources.service.js';
import { TCustomResourceDefinition } from './custom-resources.types.js';

const validResource: TCustomResourceDefinition = {
  id: 'part_attachment',
  name: 'Part Attachment',
  description: 'Attachments of a part',
  apiRoutes: {
    list: {
      request: {
        path: '/parts/{{id}}/attachments',
        method: 'GET',
        auth: { type: 'credential-propagation' },
      },
      enablePagination: true,
    },
    get: {
      request: {
        path: '/parts/{{id}}/attachments/{{id}}',
        method: 'GET',
        auth: { type: 'credential-propagation' },
      },
    },
  },
};

describe('CustomResourcesModule', () => {
  it('builds a module and resolves CustomResourcesService for a valid config', async () => {
    const module = await Test.createTestingModule({
      imports: [
        CustomResourcesModule.forRoot({ resources: [validResource] }),
      ],
    }).compile();

    expect(module.get(CustomResourcesService)).toBeDefined();
  });

  it('accepts an empty resource list', () => {
    expect(() =>
      CustomResourcesModule.forRoot({ resources: [] }),
    ).not.toThrow();
  });

  it.each(['Part-Attachment', 'part attachment', 'part-attachment'])(
    'rejects an invalid id "%s"',
    (id) => {
      expect(() =>
        CustomResourcesModule.forRoot({
          resources: [{ ...validResource, id }],
        }),
      ).toThrow();
    },
  );

  it('rejects duplicate ids', () => {
    expect(() =>
      CustomResourcesModule.forRoot({
        resources: [validResource, validResource],
      }),
    ).toThrow();
  });
});
