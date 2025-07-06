import { Module } from '@nestjs/common';
import { ActionService } from './action.service.js';
import { ModuleConfiguration } from "../../fsarch/configuration/module/module-configuration.module.js";
import Joi from "joi";


const CUSTOM_ACTIONS_SERVER_CONFIG_VALIDATOR = Joi.array().items(
  Joi.object({
    id: Joi.string().required(),
    name: Joi.string().required(),
    resources: Joi.array()
      .items(
        Joi.string().valid(
          'part',
          'part_type',
          'material',
          'material_type',
          'manufacturer',
          'short_code',
        ).required(),
      )
      .required(),
    action: Joi.object({
      type: Joi.string().valid('function').required(),
      id: Joi.string().required(),
      server_url: Joi.string().required(),
      auth: Joi.object({
        type: Joi.string().valid('credential-propagation'),
      }).required(),
    }).required(),
  })
);

@Module({
  providers: [ActionService],
  exports: [ActionService],
  imports: [
    ModuleConfiguration.register('CUSTOM_ACTIONS_SERVER_CONFIG', {
      validationSchema: CUSTOM_ACTIONS_SERVER_CONFIG_VALIDATOR,
      name: 'custom_actions',
    }),
  ],
})
export class ActionModule {}
