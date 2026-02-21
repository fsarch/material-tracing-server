import { Controller, Get } from "@nestjs/common";
import { Public } from "../../fsarch/auth/decorators/public.decorator.js";

@Controller('.well-known')
export class WellKnownController {
  @Public()
  @Get('oauth-protected-resource')
  getOAuthProtectedResource() {
    return {
      resource: 'http://localhost:8080',
      authorization_servers: ['https://login-dev.vb3d.de/realms/VB3D-Dev/protocol/openid-connect/auth'],
      jwks_uri:
        'https://login-dev.vb3d.de/realms/VB3D-Dev/protocol/openid-connect/certs',
      bearer_methods_supported: ['header', 'body', 'query'],
      scopes_supported: ['profile', 'offline_access'],
      resource_documentation: 'http://localhost:3030/docs',
      resource_policy_uri: 'http://localhost:3030/policy',
      resource_tos_uri: 'http://localhost:3030/tos',
    };
  }
}
