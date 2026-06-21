import { Controller, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ActionService } from '../../../repositories/actions/action.service.js';
import { User, UserData } from '@fsarch/server/auth';

@ApiTags('material-types')
@Controller({
  path: 'material-types/:materialTypeId/actions',
  version: '1',
})
@ApiBearerAuth()
export class ActionsController {
  constructor(private readonly actionService: ActionService) {}

  @Post(':actionId/_actions/execute')
  public async executeAction(
    @Param('actionId') actionId: string,
    @Param('materialTypeId') materialTypeId: string,
    @UserData() user: User,
  ) {
    return this.actionService.executeMaterialTypeAction(
      actionId,
      materialTypeId,
      {
        user,
      },
    );
  }
}
