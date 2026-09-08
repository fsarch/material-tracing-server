import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Joi from 'joi';
import { User } from '@fsarch/server/auth';
import { withSpan } from '@fsarch/server/tracing';

type TProductServerConfig = {
  type: 'remote';
  url: string;
  catalog_id: string;
  auth: {
    type: 'credential-propagation';
  };
};

const PRODUCT_SERVER_CONFIG_VALIDATOR = Joi.object({
  type: Joi.string().valid('remote').required(),
  url: Joi.string().required(),
  catalog_id: Joi.string().required(),
  auth: Joi.object({
    type: Joi.string().valid('credential-propagation').required(),
  }).required(),
});

/**
 * The `product_server` config section is optional: instances that don't use
 * the product-server integration can omit it entirely and simply never set
 * `productId` on a part type. Unlike `ModuleConfiguration.register` (used
 * elsewhere in this repo), this does not require the section to be present
 * at application startup - it's only validated, lazily, the first time it's
 * actually needed.
 */
@Injectable()
export class ProductServerService {
  private readonly logger = new Logger(ProductServerService.name);

  constructor(private readonly configService: ConfigService) {}

  private getConfig(): TProductServerConfig {
    const config = this.configService.get<TProductServerConfig>(
      'product_server',
    );

    if (!config) {
      throw new Error(
        'product-server is not configured (missing "product_server" config section)',
      );
    }

    const { error } = PRODUCT_SERVER_CONFIG_VALIDATOR.validate(config, {
      abortEarly: false,
    });

    if (error) {
      this.logger.error('invalid product_server config', error.details);
      throw new Error('invalid product_server config');
    }

    return config;
  }

  public isConfigured(): boolean {
    return !!this.configService.get('product_server');
  }

  /**
   * Config exposed to clients (e.g. the .meta/user-interface endpoint), so
   * the frontend knows where/whether product-server is reachable. Returns
   * `null` when the (optional) product_server section isn't configured.
   */
  public getPublicConfig(): { url: string; catalogId: string } | null {
    if (!this.isConfigured()) {
      return null;
    }

    const config = this.getConfig();

    return {
      url: config.url,
      catalogId: config.catalog_id,
    };
  }

  public async validateProductExists(
    productId: string,
    options: { user: User },
  ): Promise<boolean> {
    return withSpan(
      'product-server.validate-product-exists',
      async (span) => {
        span.setAttribute('product.id', productId);

        const config = this.getConfig();

        const url = new URL(
          `/v1/catalogs/${config.catalog_id}/items/${productId}`,
          config.url,
        );

        const accessToken = options.user.getAccessToken();

        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        span.setAttribute('http.response.status_code', res.status);

        if (res.status === 200) {
          return true;
        }

        if (res.status === 404) {
          return false;
        }

        this.logger.error(
          'failed to validate product against product-server',
          {
            status: res.status,
          },
        );

        throw new Error(
          `Unexpected response from product-server (status ${res.status})`,
        );
      },
    );
  }

  /**
   * Lists all items in the configured catalog, for use as a picker (e.g. a
   * searchable select in the dashboard). Fails open when product-server
   * isn't configured - the caller then just has an empty list to choose
   * from, instead of the whole feature blowing up.
   */
  public async listItems(
    options: { user: User },
  ): Promise<Array<{ id: string; name: string }>> {
    return withSpan('product-server.list-items', async (span) => {
      if (!this.isConfigured()) {
        this.logger.debug('product-server not configured');
        return [];
      }

      const config = this.getConfig();

      const url = new URL(
        `/v1/catalogs/${config.catalog_id}/items`,
        config.url,
      );

      const accessToken = options.user.getAccessToken();

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      span.setAttribute('http.response.status_code', res.status);

      if (!res.ok) {
        this.logger.error('failed to list items from product-server', {
          status: res.status,
        });

        throw new Error(
          `Unexpected response from product-server (status ${res.status})`,
        );
      }

      const items = (await res.json()) as Array<{ id: string; name: string }>;

      return items.map((item) => ({ id: item.id, name: item.name }));
    });
  }
}
