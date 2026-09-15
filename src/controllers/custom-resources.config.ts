import { TCustomResourceDefinition } from '../custom-resources/custom-resources.types.js';

function listRoute(
  path: string,
): TCustomResourceDefinition['apiRoutes']['list'] {
  return {
    request: {
      path,
      method: 'GET',
      auth: { type: 'credential-propagation' },
    },
    enablePagination: true,
  };
}

function getRoute(
  path: string,
): TCustomResourceDefinition['apiRoutes']['get'] {
  return {
    request: {
      path,
      method: 'GET',
      auth: { type: 'credential-propagation' },
    },
  };
}

export const REGISTERED_CUSTOM_RESOURCES: TCustomResourceDefinition[] = [
  {
    id: 'part',
    name: 'Part',
    description: 'Parts tracked in the material tracing system.',
    apiRoutes: {
      list: listRoute('/v1/parts'),
      get: getRoute('/v1/parts/{{id}}'),
    },
  },
  {
    id: 'part_type',
    name: 'Part Type',
    description: 'Part types tracked in the material tracing system.',
    apiRoutes: {
      list: listRoute('/v1/part-types'),
      get: getRoute('/v1/part-types/{{id}}'),
    },
  },
  {
    id: 'manufacturer',
    name: 'Manufacturer',
    description: 'Manufacturers tracked in the material tracing system.',
    apiRoutes: {
      list: listRoute('/v1/manufacturers'),
      get: getRoute('/v1/manufacturers/{{id}}'),
    },
  },
  {
    id: 'material_type',
    name: 'Material Type',
    description: 'Material types tracked in the material tracing system.',
    apiRoutes: {
      list: listRoute('/v1/material-types'),
      get: getRoute('/v1/material-types/{{id}}'),
    },
  },
  {
    id: 'material',
    name: 'Material',
    description: 'Materials tracked in the material tracing system.',
    apiRoutes: {
      list: listRoute('/v1/materials'),
      get: getRoute('/v1/materials/{{id}}'),
    },
  },
  {
    id: 'short_code',
    name: 'Short Code',
    description: 'Short codes tracked in the material tracing system.',
    apiRoutes: {
      list: listRoute('/v1/short-codes'),
      get: getRoute('/v1/short-codes/{{id}}'),
    },
  },
];
