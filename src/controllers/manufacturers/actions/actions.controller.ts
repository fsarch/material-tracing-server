import { Controller, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ActionService } from "../../../repositories/actions/action.service.js";
import { User } from "../../../fsarch/auth/user.js";
import { UserData } from "../../../fsarch/auth/decorators/user-data.decorator.js";

@ApiTags('manufacturers')
@Controller({
  path: 'manufacturers/:manufacturerId/actions',
  version: '1',
})
@ApiBearerAuth()
export class ActionsController {
  constructor(
    private readonly actionService: ActionService,
  ) {

  }

  @Post(':actionId/_actions/execute')
  public async executeAction(
    @Param('actionId') actionId: string,
    @Param('manufacturerId') manufacturerId: string,
    @UserData() user: User,
  ) {
    return this.actionService.executeManufacturerAction(actionId, manufacturerId, {
      user,
    });
  }
}