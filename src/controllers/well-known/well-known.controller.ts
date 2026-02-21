import { Controller, Get, Req } from "@nestjs/common";
import { Public } from "../../fsarch/auth/decorators/public.decorator.js";
import type { Request } from "express";
import { AuthService } from "../../fsarch/auth/auth.service.js";

@Controller('.well-known')
export class WellKnownController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Public()
  @Get('oauth-protected-resource')
  async getOAuthProtectedResource(@Req() req: Request) {
    const proto = this.getRequestProtocol(req);
    const host = this.getRequestHost(req);
    const resource = `${proto}://${host}`;

    const metadata = await this.authService.getOidcMetadata?.() as { authorization_endpoint?: string; jwks_uri?: string } | null | undefined;

    const jwksUri = metadata?.jwks_uri;
    const authorizationServers = metadata?.authorization_endpoint
      ? [new URL(metadata.authorization_endpoint).origin]
      : undefined;

    return {
      resource,
      authorization_servers: authorizationServers,
      jwks_uri: jwksUri,
      bearer_methods_supported: ['header', 'body', 'query'],
      scopes_supported: ['profile', 'offline_access'],
      resource_documentation: 'http://localhost:3030/docs',
      resource_policy_uri: 'http://localhost:3030/policy',
      resource_tos_uri: 'http://localhost:3030/tos',
    };
  }

  private getRequestProtocol(req: Request): string {
    const forwardedProtoHeader = req.headers['x-forwarded-proto'] as string | undefined;
    if (forwardedProtoHeader && forwardedProtoHeader.length > 0) {
      // falls mehrere Werte gesetzt sind, ersten verwenden
      const first = forwardedProtoHeader.split(',')[0].trim();
      if (first.length > 0) return first;
    }

    if (req.protocol && typeof req.protocol === 'string' && req.protocol.length > 0) {
      return req.protocol;
    }

    if (typeof req.secure === 'boolean' && req.secure) {
      return 'https';
    }

    return 'http';
  }

  private getRequestHost(req: Request): string {
    const forwardedHostHeader = req.headers['x-forwarded-host'] as string | undefined;
    if (forwardedHostHeader && forwardedHostHeader.length > 0) {
      const first = forwardedHostHeader.split(',')[0].trim();
      if (first.length > 0) return first;
    }

    const hostHeader = req.headers['host'] as string | undefined;
    if (hostHeader && hostHeader.length > 0) {
      return hostHeader;
    }

    return 'localhost:8080';
  }
}
