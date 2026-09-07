import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserData, User } from '@fsarch/server/auth';
import { ProductServerService } from '../../repositories/product-server/product-server.service.js';

@ApiTags('product-server')
@Controller({
  path: 'product-server',
  version: '1',
})
@ApiBearerAuth()
export class ProductServerController {
  constructor(private readonly productServerService: ProductServerService) {}

  @Get('items')
  public async ListItems(@UserData() user: User) {
    const data = await this.productServerService.listItems({ user });

    return { data };
  }
}
