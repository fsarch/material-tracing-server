import { Test, TestingModule } from '@nestjs/testing';
import {
  CustomResourcesService,
  CUSTOM_RESOURCES,
} from './custom-resources.service.js';
import { TCustomResourceDefinition } from './custom-resources.types.js';

describe('CustomResourcesService', () => {
  let service: CustomResourcesService;
  const resources: TCustomResourceDefinition[] = [
    {
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
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomResourcesService,
        { provide: CUSTOM_RESOURCES, useValue: resources },
      ],
    }).compile();

    service = module.get<CustomResourcesService>(CustomResourcesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('returns the resources it was configured with', () => {
    expect(service.getAll()).toEqual(resources);
  });
});
