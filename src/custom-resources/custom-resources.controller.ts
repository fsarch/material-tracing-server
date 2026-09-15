import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CustomResourcesService } from './custom-resources.service.js';

@ApiTags('.meta')
@Controller({ path: '.meta/custom-resources', version: '1' })
@ApiBearerAuth()
export class CustomResourcesController {
  constructor(
    private readonly customResourcesService: CustomResourcesService,
  ) {}

  @Get()
  public async List() {
    return { data: this.customResourcesService.getAll() };
  }
}
