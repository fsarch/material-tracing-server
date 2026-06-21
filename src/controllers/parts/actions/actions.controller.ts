import { Controller, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ActionService } from '../../../repositories/actions/action.service.js';
import { UserData, User } from '@fsarch/server/auth';

@ApiTags('parts')
@Controller({
  path: 'parts/:partId/actions',
  version: '1',
})
@ApiBearerAuth()
export class ActionsController {
  constructor(private readonly actionService: ActionService) {}

  @Post(':actionId/_actions/execute')
  public async executeAction(
    @Param('actionId') actionId: string,
    @Param('partId') partId: string,
    @UserData() user: User,
  ) {
    return this.actionService.executePartAction(actionId, partId, {
      user,
    });
  }
}
