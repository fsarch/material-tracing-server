import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ConfigService } from "@nestjs/config";

@ApiTags('.meta')
@Controller({
  path: '.meta',
  version: '1',
})
@ApiBearerAuth()
export class MetaController {
  constructor(
    private readonly configService: ConfigService,
  ) {
  }

  @Get('user-interface')
  public async GetUiMeta() {
    const imageConfig = this.configService.get<{ admin_url: string; user_url: string; }>('images');

    return {
      imageServer: {
        adminUrl: imageConfig.admin_url,
        userUrl: imageConfig.user_url,
      }
    };
  }
}
