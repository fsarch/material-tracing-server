# Custom Resources Module

This module lets a service advertise "custom resources" — external or app-specific resource types that a client (typically a frontend) can list and fetch via a generic API, without the client having to know the concrete routes up front. It is deliberately self-contained (no dependency on this repo's YAML config system) so it can later be extracted into `@fsarch/server` and reused by other fsarch services unchanged.

## Registration

The module is a classic NestJS dynamic module, registered once via `forRoot()` with the list of resources it should advertise — similar to `ConfigModule.forRoot()` or `TypeOrmModule.forRoot()`:

```typescript
import { CustomResourcesModule } from './custom-resources/custom-resources.module.js';

@Module({
  imports: [
    CustomResourcesModule.forRoot({
      resources: [
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
      ],
    }),
  ],
})
export class ControllersModule {}
```

`forRoot()` validates the given resources with a Joi schema and throws synchronously (at bootstrap) if the config is invalid — see [Validation](#validation) below.

## Endpoint

```
GET /v1/.meta/custom-resources
```

Returns all registered resource definitions:

```json
{
  "data": [
    {
      "id": "part_attachment",
      "name": "Part Attachment",
      "description": "Attachments of a part",
      "apiRoutes": {
        "list": {
          "request": {
            "path": "/parts/{{id}}/attachments",
            "method": "GET",
            "auth": { "type": "credential-propagation" }
          },
          "enablePagination": true
        },
        "get": {
          "request": {
            "path": "/parts/{{id}}/attachments/{{id}}",
            "method": "GET",
            "auth": { "type": "credential-propagation" }
          }
        }
      }
    }
  ]
}
```

Authentication is enforced globally for the whole application (via `.enableAuth()` in `src/main.ts`), so this endpoint requires the same bearer token as every other route — there is no extra guard here.

## Resource Definition

| Field                          | Type                                              | Description                                                                 |
|---------------------------------|----------------------------------------------------|-------------------------------------------------------------------------------|
| `id`                            | `string`                                          | Unique identifier, must match `^[a-z0-9_]+$` (lowercase letters, digits, `_` only — no uppercase, spaces or hyphens). See [Validation](#validation). |
| `name`                          | `string`                                          | Human-readable name.                                                          |
| `description`                   | `string`                                          | Human-readable description.                                                   |
| `apiRoutes.list.request`        | [`Request`](#request)                             | How to call the endpoint that lists this resource.                            |
| `apiRoutes.list.enablePagination` | `boolean`                                        | Whether the list endpoint supports pagination.                                |
| `apiRoutes.get.request`         | [`Request`](#request)                             | How to call the endpoint that fetches a single instance of this resource.     |

### `Request`

| Field    | Type                                                        | Description                                  |
|----------|--------------------------------------------------------------|-----------------------------------------------|
| `path`   | `string`                                                     | Request path, may contain placeholders (see below). |
| `method` | `'GET' \| 'POST' \| 'PUT' \| 'PATCH' \| 'DELETE'`             | HTTP method to use.                          |
| `auth`   | `{ type: 'credential-propagation' }`                          | Auth strategy, same convention as custom actions (`src/repositories/actions/`) and the function-server/function-node-worker: the caller's own credentials are propagated to the downstream request. |

### Path Placeholders

`path` values may contain placeholders wrapped in `{{ }}` (chosen over `##` to avoid clashing with `#` as a YAML/Markdown comment marker, and because `{{}}` is the common templating convention):

- `{{id}}` — the id of the resource instance itself.
- `{{$system.crd.[<custom-resource-service-name>].[<custom-resource-id>].id}}` — a reference to the id of another custom resource definition. `<custom-resource-service-name>` is optional and only needed when referencing a custom resource defined by a different service.

This module does **not** resolve these placeholders itself — it only serves the definitions as configured. Resolution is the responsibility of the consumer (e.g. a frontend) that reads this endpoint.

## Validation

`forRoot()` validates the given `resources` array with Joi and throws an `Error` at module-registration time (i.e. at application bootstrap) if:

- any `id` does not match `^[a-z0-9_]+$`,
- the same `id` is used more than once,
- any required field is missing or has the wrong type.

This is a fail-fast check, not a runtime/request-time validation — an invalid config prevents the application from starting rather than causing errors on individual requests.

## Structure

```
src/custom-resources/
├── custom-resources.types.ts      # TCustomResourceDefinition and related types
├── custom-resources.service.ts    # CustomResourcesService, reads the registered list
├── custom-resources.controller.ts # GET /.meta/custom-resources
├── custom-resources.module.ts     # forRoot() + Joi validation
└── README.md
```

## Design Notes

- No coupling to `@nestjs/config`, `ModuleConfigurationService`, or the app's `config.yaml` — resources are passed as a plain array at `forRoot()` call time. This keeps the module portable so it can be lifted into `@fsarch/server` as-is if it proves useful.
- Only `forRoot()` is implemented. A `forFeature()` that lets individual feature modules contribute their own resources into a shared registry is a natural future extension (mirroring `TypeOrmModule.forRoot()`/`forFeature()`) but is out of scope until there is more than one place in this service that needs to register resources.
