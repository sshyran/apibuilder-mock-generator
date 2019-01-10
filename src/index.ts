import {
  ApiBuilderService,
  ApiBuilderServiceConfig,
  isEnumType,
  isModelType,
  isUnionType,
} from 'apibuilder-js';

import {
  mockEnum,
  mockModel,
  mockUnion,
  ModelGeneratorOptions,
} from './generators';

export class Generator {
  service: ApiBuilderService;

  constructor(service: ApiBuilderService) {
    this.service = service;
  }

  public enum(name: string) {
    const type = this.service.findTypeByName(name);

    if (!isEnumType(type)) {
      throw new Error(`${name} did not match an enum in ${this.service} service`);
    }

    return mockEnum(type);
  }

  public model(name: string, options: ModelGeneratorOptions) {
    const type = this.service.findTypeByName(name);

    if (!isModelType(type)) {
      throw new Error(`${name} did not match a model in ${this.service} service`);
    }

    return mockModel(type, options);
  }

  public union(name: string) {
    const type = this.service.findTypeByName(name);

    if (!isUnionType(type)) {
      throw new Error(`${name} did not match an union in ${this.service} service`);
    }

    return mockUnion(type);
  }
}

export function createMockGenerator(schema: ApiBuilderServiceConfig) {
  const service = new ApiBuilderService(schema);
  return new Generator(service);
}
