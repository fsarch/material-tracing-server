import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { ActionService } from '../../repositories/actions/action.service.js';
import { ProductServerService } from '../../repositories/product-server/product-server.service.js';

@ApiTags('.meta')
@Controller({
  path: '.meta',
  version: '1',
})
@ApiBearerAuth()
export class MetaController {
  constructor(
    private readonly configService: ConfigService,
    private readonly actionsService: ActionService,
    private readonly productServerService: ProductServerService,
  ) {}

  @Get('user-interface')
  public async GetUiMeta() {
    const imageConfig = this.configService.get<{
      admin_url: string;
      user_url: string;
    }>('images');

    return {
      imageServer: {
        adminUrl: imageConfig.admin_url,
        userUrl: imageConfig.user_url,
      },
      productServer: this.productServerService.getPublicConfig(),
      customActions:
        await this.actionsService.getPublicCustomActionDefinition(),
    };
  }
}
