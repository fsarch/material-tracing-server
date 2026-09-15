import { DynamicModule, Module } from '@nestjs/common';
import Joi from 'joi';
import { CustomResourcesController } from './custom-resources.controller.js';
import {
  CustomResourcesService,
  CUSTOM_RESOURCES,
} from './custom-resources.service.js';
import { TCustomResourceDefinition } from './custom-resources.types.js';

const CUSTOM_RESOURCE_ID_PATTERN = /^[a-z0-9_]+$/;

const REQUEST_SCHEMA = Joi.object({
  path: Joi.string().required(),
  method: Joi.string()
    .valid('GET', 'POST', 'PUT', 'PATCH', 'DELETE')
    .required(),
  auth: Joi.object({
    type: Joi.string().valid('credential-propagation').required(),
  }).required(),
});

const CUSTOM_RESOURCES_SCHEMA = Joi.array()
  .items(
    Joi.object({
      id: Joi.string().pattern(CUSTOM_RESOURCE_ID_PATTERN).required(),
      name: Joi.string().required(),
      description: Joi.string().required(),
      apiRoutes: Joi.object({
        list: Joi.object({
          request: REQUEST_SCHEMA.required(),
          enablePagination: Joi.boolean().required(),
        }).required(),
        get: Joi.object({
          request: REQUEST_SCHEMA.required(),
        }).required(),
      }).required(),
    }),
  )
  .unique('id');

export type CustomResourcesModuleOptions = {
  resources: TCustomResourceDefinition[];
};

@Module({})
export class CustomResourcesModule {
  static forRoot(options: CustomResourcesModuleOptions): DynamicModule {
    const { error } = CUSTOM_RESOURCES_SCHEMA.validate(options.resources, {
      abortEarly: false,
    });

    if (error) {
      throw new Error(`Invalid custom resources config: ${error.message}`);
    }

    return {
      module: CustomResourcesModule,
      controllers: [CustomResourcesController],
      providers: [
        { provide: CUSTOM_RESOURCES, useValue: options.resources },
        CustomResourcesService,
      ],
      exports: [CustomResourcesService],
    };
  }
}
