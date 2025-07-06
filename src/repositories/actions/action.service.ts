import { Inject, Injectable, Logger, NotFoundException, NotImplementedException } from '@nestjs/common';
import { ModuleConfigurationService } from "../../fsarch/configuration/module/module-configuration.service.js";
import { User } from "../../fsarch/auth/user.js";

type TCustomActionConfig = {
  id: string;
  name: string;
  action: {
    type: 'function';
    id: string;
    server_url: string;
    auth: {
      type: 'credential-propagation';
    };
  };
  resources: Array<'part' | 'part_type' | 'material' | 'material_type' | 'short_code' | 'manufacturer'>;
};

@Injectable()
export class ActionService {
  private readonly logger = new Logger(ActionService.name);

  constructor(
    @Inject('CUSTOM_ACTIONS_SERVER_CONFIG')
    private readonly customActionConfig: ModuleConfigurationService<Array<TCustomActionConfig>>,
  ) {}

  public async getPublicCustomActionDefinition() {
    return this.customActionConfig.get().map((ca) => ({
      id: ca.id,
      name: ca.name,
      resources: ca.resources,
    }));
  }

  public async getCustomAction(actionId: string) {
    return this.customActionConfig.get()
      .find((c) => c.id === actionId);
  }

  private async executeAction(
    action: TCustomActionConfig,
    payload: unknown,
    options: {
      user: User,
    },
  ): Promise<{ success: true; result: unknown } | { success: false }> {
    if (action.action.auth.type !== 'credential-propagation') {
      throw new NotImplementedException();
    }

    const accessToken = options.user.getAccessToken();

    const url = new URL(`/v1/functions/${action.action.id}/executions?wait=true`, action.action.server_url);
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        arguments: [payload],
      }),
    });

    if (!res.ok) {
      this.logger.error('failed to execute action', {
        status: res.status,
      });
      return {
        success: false,
      };
    }

    const data = await res.json();

    return {
      success: true,
      result: data.result,
    };
  }

  public async executePartAction(actionId: string, partId: string, options: { user: User }): Promise<{ success: true; result: unknown } | { success: false }> {
    const action = await this.getCustomAction(actionId);

    if (!action.resources.includes('part')) {
      throw new NotFoundException();
    }

    return this.executeAction(action, {
      id: partId,
    }, options);
  }
}
