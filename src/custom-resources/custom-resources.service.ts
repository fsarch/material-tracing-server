import { Inject, Injectable } from '@nestjs/common';
import { TCustomResourceDefinition } from './custom-resources.types.js';

export const CUSTOM_RESOURCES = Symbol('CUSTOM_RESOURCES');

@Injectable()
export class CustomResourcesService {
  constructor(
    @Inject(CUSTOM_RESOURCES)
    private readonly resources: TCustomResourceDefinition[],
  ) {}

  public getAll(): TCustomResourceDefinition[] {
    return this.resources;
  }
}
