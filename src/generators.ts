import {
  ApiBuilderArray,
  ApiBuilderEnum,
  ApiBuilderMap,
  ApiBuilderModel,
  ApiBuilderPrimitiveType,
  ApiBuilderType,
  ApiBuilderUnion,
  Kind,
  isArrayType,
  isEnumType,
  isMapType,
  isModelType,
  isPrimitiveType,
  isUnionType,
} from 'apibuilder-js';

import faker from 'faker';

type Map<T> = {
  [key: string]: T,
};

export function mockPrimitive(type: ApiBuilderPrimitiveType): any {
  switch (type.fullName) {
    case Kind.STRING:
      return faker.lorem.word();
    case Kind.BOOLEAN:
      return faker.random.boolean();
    case Kind.DATE_ISO8601:
      return faker.date.future().toISOString().slice(0, 10);
    case Kind.DATE_TIME_ISO8601:
      return faker.date.future().toISOString();
    case Kind.DECIMAL:
    case Kind.DOUBLE:
      return faker.random.number({ precision: 0.01 });
    case Kind.INTEGER:
    case Kind.LONG:
      return faker.random.number({ precision: 1 });
    case Kind.JSON:
      return JSON.stringify({});
    case Kind.OBJECT:
      return {};
    case Kind.UNIT:
      return undefined;
    case Kind.UUID:
      return faker.random.uuid();
    default:
      return undefined;
  }
}

export interface ArrayGeneratorOptions {
  readonly minimum?: number;
  readonly maximum?: number;
}

export function mockArray(
  array: ApiBuilderArray,
  options: ArrayGeneratorOptions = {},
): any[] {
  const {
    minimum = 0,
    maximum = 3,
  } = options;

  const length = faker.random.number({
    min: minimum,
    max: Math.max(minimum, maximum),
  });

  return Array.from({ length }, () => mock(array.ofType));
}

export function mockMap(map: ApiBuilderMap): Map<any> {
  return Array.from({
    length: faker.random.number({ min: 1, max: 3 }),
  }).reduce(
    previousValue => ({
      ...previousValue,
      [faker.hacker.noun()]: mock(map.ofType),
    }),
    {},
  );
}

export function mockEnum(enumeration: ApiBuilderEnum): string | undefined {
  const value = faker.random.arrayElement(enumeration.values);
  return (value != null) ? value.name : undefined;
}

export interface ModelGeneratorOptions {
  readonly onlyRequired?: boolean;
  readonly useDefault?: boolean;
  readonly overrideProps?: { [key: string]: any };
}

export function mockModel(
  model: ApiBuilderModel,
  options: ModelGeneratorOptions = {},
): { [key: string]: any } {
  const {
    onlyRequired = false,
    useDefault = false,
    overrideProps = {},
  } = options;

  return model.fields.filter((field) => {
    return !onlyRequired || field.isRequired;
  }).reduce((previousValue, field) => {
    let value;

    const hasRange = field.minimum != null || field.maximum != null;
    const hasDefault = field.default != null;

    if (overrideProps.hasOwnProperty(field.name)) {
      value = overrideProps[field.name];
    } else if (!field.isRequired && hasDefault && useDefault) {
      value = field.default;
    } else if (isArrayType(field.type) && hasRange) {
      value = mock(field.type, {
        maximum: field.maximum,
        minimum: field.minimum,
      });
    } else if (
      isPrimitiveType(field.type)
      && field.type.typeName === Kind.STRING
      && hasRange) {
      value = faker.random.alphaNumeric(faker.random.number({
        min: field.minimum,
        max: field.maximum,
      }));
    } else {
      value = mock(field.type);
    }

    return { ...previousValue, [field.name]: value };
  }, {}); /* tslint:disable-line align */
}

export function mockUnion(union: ApiBuilderUnion): any {
  const type = faker.random.arrayElement(union.types);

  let discriminatorKey;

  if (union.discriminator != null) {
    discriminatorKey = union.discriminator;
  } else {
    discriminatorKey = 'discriminator';
  }

  let discriminatorValue;

  if (type.discriminatorValue != null) {
    discriminatorValue = type.discriminatorValue;
  } else if (
    isUnionType(type.type)
    || isModelType(type.type)
    || isEnumType(type.type)
    || isPrimitiveType(type.type)
  ) {
    discriminatorValue = type.type.shortName;
  }

  return (type != null) ? {
    [discriminatorKey]: discriminatorValue,
    ...mock(type.type),
  } : undefined;
}

export function mock(type: ApiBuilderPrimitiveType): any;
export function mock(type: ApiBuilderArray, options?: ArrayGeneratorOptions): any[];
export function mock(type: ApiBuilderMap): { [key: string]: any };
export function mock(type: ApiBuilderModel, options?: ModelGeneratorOptions): object;
export function mock(type: ApiBuilderEnum): string;
export function mock(type: ApiBuilderUnion): any;
export function mock(type: ApiBuilderType): any;
export function mock(type: any, options?: any): any {
  let mock;

  if (isArrayType(type)) {
    mock = mockArray(type, options);
  } else if (isMapType(type)) {
    mock = mockMap(type);
  } else if (isUnionType(type)) {
    mock = mockUnion(type);
  } else if (isModelType(type)) {
    mock = mockModel(type, options);
  } else if (isEnumType(type)) {
    mock = mockEnum(type);
  } else if (isPrimitiveType(type)) {
    mock = mockPrimitive(type);
  }

  return mock;
}
