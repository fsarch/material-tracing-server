import { Module } from '@nestjs/common';
import { MetaController } from './meta.controller.js';
import { ModuleConfiguration } from "../../fsarch/configuration/module/module-configuration.module.js";
import Joi from "joi";

const IMAGE_SERVER_CONFIG_VALIDATOR = Joi.object({
  type: Joi.string().valid('remote').required(),
  admin_url: Joi.string().required(),
  user_url: Joi.string().required(),
});

@Module({
  controllers: [MetaController],
  imports: [
    ModuleConfiguration.register('IMAGE_SERVER_CONFIG', {
      validationSchema: IMAGE_SERVER_CONFIG_VALIDATOR,
      name: 'images',
    }),
  ]
})
export class MetaModule {}
