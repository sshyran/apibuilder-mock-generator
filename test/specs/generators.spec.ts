/* tslint:disable max-line-length */

import * as apibuilder from 'apibuilder-js';
import { mockPrimitive, mockArray, mockMap, mockModel, mockEnum, mockUnion } from '../../src/generators';
import { createApiBuilderServiceConfig } from '../helpers/apibuilder';
import { isJson, isUuid, isDateIso8601, isDateTimeIso8601 } from '../helpers/predicates';

describe('mockPrimitive', () => {
  test('can mock a primitive string', () => {
    const fqn = new apibuilder.FullyQualifiedName('string');
    const primitive = new apibuilder.ApiBuilderPrimitiveType(fqn);
    expect(mockPrimitive(primitive)).toEqual(expect.any(String));
  });

  test('can mock a primitive boolean', () => {
    const fqn = new apibuilder.FullyQualifiedName('boolean');
    const primitive = new apibuilder.ApiBuilderPrimitiveType(fqn);
    expect(mockPrimitive(primitive)).toEqual(expect.any(Boolean));
  });

  test('can mock a primitive date iso string', () => {
    const fqn = new apibuilder.FullyQualifiedName('date-iso8601');
    const primitive = new apibuilder.ApiBuilderPrimitiveType(fqn);
    expect(isDateIso8601(mockPrimitive(primitive))).toBe(true);
  });

  test('can mock a primitive date time iso string', () => {
    const fqn = new apibuilder.FullyQualifiedName('date-time-iso8601');
    const primitive = new apibuilder.ApiBuilderPrimitiveType(fqn);
    expect(isDateTimeIso8601(mockPrimitive(primitive))).toBe(true);
  });

  test('can mock a primitive decimal', () => {
    const fqn = new apibuilder.FullyQualifiedName('decimal');
    const primitive = new apibuilder.ApiBuilderPrimitiveType(fqn);
    expect(mockPrimitive(primitive)).toEqual(expect.any(Number));
  });

  test('can mock a primitive double', () => {
    const fqn = new apibuilder.FullyQualifiedName('double');
    const primitive = new apibuilder.ApiBuilderPrimitiveType(fqn);
    expect(mockPrimitive(primitive)).toEqual(expect.any(Number));
  });

  test('can mock a primitive integer', () => {
    const fqn = new apibuilder.FullyQualifiedName('integer');
    const primitive = new apibuilder.ApiBuilderPrimitiveType(fqn);
    expect(mockPrimitive(primitive)).toEqual(expect.any(Number));
  });

  test('can mock a primitive long', () => {
    const fqn = new apibuilder.FullyQualifiedName('long');
    const primitive = new apibuilder.ApiBuilderPrimitiveType(fqn);
    expect(mockPrimitive(primitive)).toEqual(expect.any(Number));
  });

  test('can mock a primitive json string', () => {
    const fqn = new apibuilder.FullyQualifiedName('json');
    const primitive = new apibuilder.ApiBuilderPrimitiveType(fqn);
    expect(isJson(mockPrimitive(primitive))).toBe(true);
  });

  test('can mock a primitive object', () => {
    const fqn = new apibuilder.FullyQualifiedName('object');
    const primitive = new apibuilder.ApiBuilderPrimitiveType(fqn);
    expect(mockPrimitive(primitive)).toEqual(expect.any(Object));
  });

  test('can mock a primitive unit', () => {
    const fqn = new apibuilder.FullyQualifiedName('unit');
    const primitive = new apibuilder.ApiBuilderPrimitiveType(fqn);
    expect(mockPrimitive(primitive)).toBeUndefined();
  });

  test('can mock a primitive uuid', () => {
    const fqn = new apibuilder.FullyQualifiedName('uuid');
    const primitive = new apibuilder.ApiBuilderPrimitiveType(fqn);
    expect(isUuid(mockPrimitive(primitive))).toBe(true);
  });
});

describe('mockEnum', () => {
  test('can mock enum value', () => {
    const service = new apibuilder.ApiBuilderService(createApiBuilderServiceConfig({
      enums: [{
        attributes: [],
        name: 'breed',
        plural: 'breeds',
        values: [
          { name: 'russian_blue' },
          { name: 'persian' },
          { name: 'siamese' },
          { name: 'maine_coon' },
        ],
      }],
    }));

    service.enums.forEach((enumeration) => {
      const value = mockEnum(enumeration);
      expect(enumeration.values.some((enumValue) => {
        return enumValue.name === value;
      })).toBe(true);
    });
  });
});

describe('mockModel', () => {
  test('can mock model containing field of primitive type', () => {
    const service = new apibuilder.ApiBuilderService(createApiBuilderServiceConfig({
      models: [{
        name: 'pet',
        plural: 'pets',
        fields: [{
          name: 'name',
          type: 'string',
          attributes: [],
          required: true,
        }, {
          name: 'age',
          type: 'integer',
          attributes: [],
          required: true,
        }],
        attributes: [],
      }],
    }));

    service.models.forEach((model) => {
      const mock = mockModel(model);
      expect(mock).toEqual({
        name: expect.any(String),
        age: expect.any(Number),
      });
    });
  });

  test('can mock model containing field of enum type', () => {
    const service = new apibuilder.ApiBuilderService(createApiBuilderServiceConfig({
      enums: [{
        attributes: [],
        name: 'breed',
        plural: 'breeds',
        values: [
          { name: 'russian_blue' },
          { name: 'persian' },
          { name: 'siamese' },
          { name: 'maine_coon' },
        ],
      }],
      models: [{
        name: 'pet',
        plural: 'pets',
        fields: [{
          name: 'name',
          type: 'string',
          attributes: [],
          required: true,
        }, {
          name: 'breed',
          type: 'breed',
          attributes: [],
          required: true,
        }],
        attributes: [],
      }],
    }));

    service.models.forEach((model) => {
      expect(mockModel(model)).toEqual({
        name: expect.any(String),
        breed: expect.stringMatching(/^(russian_blue|persian|siamese|maine_coon)$/),
      });
    });
  });

  test('can mock model containing field of model type', () => {
    const service = new apibuilder.ApiBuilderService(createApiBuilderServiceConfig({
      models: [{
        name: 'pet',
        plural: 'pets',
        fields: [{
          name: 'name',
          type: 'name',
          attributes: [],
          required: true,
        }],
        attributes: [],
      }, {
        name: 'name',
        plural: 'names',
        fields: [{
          name: 'first',
          type: 'string',
          attributes: [],
          required: true,
        }, {
          name: 'last',
          type: 'string',
          attributes: [],
          required: true,
        }],
        attributes: [],
      }],
    }));

    service.models.filter((model) => {
      return model.shortName === 'pet';
    }).forEach((model) => {
      expect(mockModel(model)).toEqual({
        name: {
          first: expect.any(String),
          last: expect.any(String),
        },
      });
    });
  });

  test('can disallow generation of optional fields', () => {
    const service = new apibuilder.ApiBuilderService(createApiBuilderServiceConfig({
      enums: [{
        name: 'gender',
        plural: 'genders',
        values: [
          { name: 'male' },
          { name: 'female' },
        ],
        attributes: [],
      }],
      models: [{
        name: 'pet',
        plural: 'pets',
        fields: [{
          name: 'id',
          type: 'uuid',
          attributes: [],
          required: true,
        }, {
          name: 'name',
          type: 'string',
          attributes: [],
          required: false,
        }, {
          name: 'gender',
          type: 'gender',
          attributes: [],
          required: true,
        }],
        attributes: [],
      }],
    }));

    service.models.forEach((model) => {
      expect(mockModel(model, {
        onlyRequired: true,
      })).not.toHaveProperty('name');
    });
  });

  test('can allow generation of optional fields', () => {
    const service = new apibuilder.ApiBuilderService(createApiBuilderServiceConfig({
      enums: [{
        name: 'gender',
        plural: 'genders',
        values: [
          { name: 'male' },
          { name: 'female' },
        ],
        attributes: [],
      }],
      models: [{
        name: 'pet',
        plural: 'pets',
        fields: [{
          name: 'id',
          type: 'uuid',
          attributes: [],
          required: true,
        }, {
          name: 'name',
          type: 'string',
          attributes: [],
          required: false,
        }, {
          name: 'gender',
          type: 'gender',
          attributes: [],
          required: true,
        }],
        attributes: [],
      }],
    }));

    service.models.forEach((model) => {
      expect(mockModel(model, {
        onlyRequired: false,
      })).toHaveProperty('name');
    });
  });

  test('can use default value for optional fields', () => {
    const service = new apibuilder.ApiBuilderService(createApiBuilderServiceConfig({
      enums: [{
        name: 'gender',
        plural: 'genders',
        values: [
          { name: 'male' },
          { name: 'female' },
        ],
        attributes: [],
      }],
      models: [{
        name: 'pet',
        plural: 'pets',
        fields: [{
          name: 'id',
          type: 'uuid',
          attributes: [],
          required: true,
        }, {
          name: 'name',
          default: 'anonymous',
          type: 'string',
          attributes: [],
          required: false,
        }, {
          name: 'gender',
          type: 'gender',
          attributes: [],
          required: true,
        }],
        attributes: [],
      }],
    }));

    service.models.forEach((model) => {
      expect(mockModel(model, {
        useDefault: true,
        onlyRequired: false,
      })).toHaveProperty('name', 'anonymous');
    });
  });

  test('can use field examples as generated value', () => {
    const service = new apibuilder.ApiBuilderService(createApiBuilderServiceConfig({
      models: [{
        name: 'pet',
        plural: 'pets',
        fields: [{
          name: 'id',
          type: 'uuid',
          attributes: [],
          required: true,
        }, {
          name: 'name',
          type: 'string',
          attributes: [],
          required: true,
          example: 'Lucy',
        }],
        attributes: [],
      }],
    }));

    service.models.forEach((model) => {
      expect(mockModel(model, {
        useExample: true,
      })).toHaveProperty('name', 'Lucy');
    });
  });

  test('does not use field example as generated value', () => {
    const service = new apibuilder.ApiBuilderService(createApiBuilderServiceConfig({
      models: [{
        name: 'pet',
        plural: 'pets',
        fields: [{
          name: 'id',
          type: 'uuid',
          attributes: [],
          required: true,
        }, {
          name: 'name',
          type: 'string',
          attributes: [],
          required: true,
          example: 'Lucy',
        }],
        attributes: [],
      }],
    }));

    service.models.forEach((model) => {
      expect(mockModel(model)).not.toHaveProperty('name', 'Lucy');
    });
  });

  test('can override field values', () => {
    const service = new apibuilder.ApiBuilderService(createApiBuilderServiceConfig({
      models: [{
        name: 'pet',
        plural: 'pets',
        fields: [{
          name: 'id',
          type: 'uuid',
          attributes: [],
          required: true,
        }, {
          name: 'name',
          type: 'string',
          attributes: [],
          required: true,
        }],
        attributes: [],
      }],
    }));

    service.models.forEach((model) => {
      expect(mockModel(model, {
        properties: {
          name: 'Papi',
        },
      })).toEqual(expect.objectContaining({
        name: 'Papi',
      }));
    });
  });

  test('takes into consideration maximum value for field of type array', () => {
    const service = new apibuilder.ApiBuilderService(createApiBuilderServiceConfig({
      models: [{
        name: 'pet',
        plural: 'pets',
        fields: [{
          name: 'id',
          type: 'uuid',
          attributes: [],
          required: true,
        }, {
          name: 'name',
          type: 'string',
          attributes: [],
          required: true,
        }, {
          name: 'owners',
          type: '[owner]',
          attributes: [],
          maximum: 0,
          required: true,
        }],
        attributes: [],
      }, {
        name: 'owner',
        plural: 'owners',
        fields: [{
          name: 'id',
          type: 'uuid',
          attributes: [],
          required: true,
        }, {
          name: 'name',
          type: 'string',
          attributes: [],
          required: true,
        }],
        attributes: [],
      }],
    }));

    service.models.filter((model) => {
      return model.shortName === 'pet';
    }).forEach((model) => {
      const mock = mockModel(model);
      expect(mock).toHaveProperty('owners', expect.any(Array));
      expect(mock.owners).toHaveLength(0);
    });
  });

  test('takes into consideration minimum value for field of type array', () => {
    const service = new apibuilder.ApiBuilderService(createApiBuilderServiceConfig({
      models: [{
        name: 'pet',
        plural: 'pets',
        fields: [{
          name: 'id',
          type: 'uuid',
          attributes: [],
          required: true,
        }, {
          name: 'name',
          type: 'string',
          attributes: [],
          required: true,
        }, {
          name: 'owners',
          type: '[owner]',
          attributes: [],
          minimum: 5,
          required: true,
        }],
        attributes: [],
      }, {
        name: 'owner',
        plural: 'owners',
        fields: [{
          name: 'id',
          type: 'uuid',
          attributes: [],
          required: true,
        }, {
          name: 'name',
          type: 'string',
          attributes: [],
          required: true,
        }],
        attributes: [],
      }],
    }));

    service.models.filter((model) => {
      return model.shortName === 'pet';
    }).forEach((model) => {
      const mock = mockModel(model);
      expect(mock).toHaveProperty('owners', expect.any(Array));
      expect(mock.owners.length).toBeGreaterThanOrEqual(5);
    });
  });

  test('takes into consideration maximum value for field of type string', () => {
    const service = new apibuilder.ApiBuilderService(createApiBuilderServiceConfig({
      models: [{
        name: 'pet',
        plural: 'pets',
        fields: [{
          name: 'id',
          type: 'uuid',
          attributes: [],
          required: true,
        }, {
          name: 'name',
          type: 'string',
          attributes: [],
          maximum: 1,
          required: true,
        }],
        attributes: [],
      }],
    }));

    service.models.filter((model) => {
      return model.shortName === 'pet';
    }).forEach((model) => {
      const mock = mockModel(model);
      expect(mock).toHaveProperty('name', expect.any(String));
      expect(mock.name.length).toBeLessThanOrEqual(1);
    });
  });

  test('takes into consideration minimum value for field of type string', () => {
    const service = new apibuilder.ApiBuilderService(createApiBuilderServiceConfig({
      models: [{
        name: 'pet',
        plural: 'pets',
        fields: [{
          name: 'id',
          type: 'uuid',
          attributes: [],
          required: true,
        }, {
          name: 'name',
          type: 'string',
          attributes: [],
          minimum: 10,
          required: true,
        }],
        attributes: [],
      }],
    }));

    service.models.filter((model) => {
      return model.shortName === 'pet';
    }).forEach((model) => {
      const mock = mockModel(model);
      expect(mock).toHaveProperty('name', expect.any(String));
      expect(mock.name.length).toBeGreaterThanOrEqual(10);
    });
  });
});

describe('mockUnion', () => {
  test('can generate primitive union types', () => {
    const service = new apibuilder.ApiBuilderService(createApiBuilderServiceConfig({
      unions: [{
        name: 'response_code',
        plural: 'response_codes',
        types: [{
          type: 'integer',
          attributes: [],
        }],
        attributes: [],
      }],
    }));

    service.unions.forEach((union) => {
      const mock = mockUnion(union);
      expect(mock).toEqual({
        discriminator: 'integer',
        value: expect.any(Number),
      });
    });
  });

  test('can generate enum union types', () => {
    const service = new apibuilder.ApiBuilderService(createApiBuilderServiceConfig({
      unions: [{
        name: 'response_code',
        plural: 'response_codes',
        types: [{
          type: 'response_code_option',
          attributes: [],
        }],
        attributes: [],
      }],
      enums: [{
        name: 'response_code_option',
        plural: 'response_code_options',
        values: [
          { name: 'default' },
        ],
        attributes: [],
      }],
    }));

    service.unions.forEach((union) => {
      const mock = mockUnion(union);
      expect(mock).toEqual({
        discriminator: 'response_code_option',
        value: 'default',
      });
    });
  });

  test('can generate model union types', () => {
    const service = new apibuilder.ApiBuilderService(createApiBuilderServiceConfig({
      unions: [{
        name: 'diff',
        plural: 'diffs',
        types: [{
          type: 'diff_breaking',
          attributes: [],
        }],
        attributes: [],
      }],
      models: [{
        name: 'diff_breaking',
        plural: 'diff_breakings',
        fields: [{
          name: 'description',
          type: 'string',
          required: true,
          attributes: [],
        }],
        attributes: [],
      }],
    }));

    service.unions.forEach((union) => {
      const mock = mockUnion(union);
      expect(mock).toEqual({
        discriminator: 'diff_breaking',
        description: expect.any(String),
      });
    });
  });

  test('allows selection of union type to be generated', () => {
    const service = new apibuilder.ApiBuilderService(createApiBuilderServiceConfig({
      unions: [{
        name: 'response_code',
        plural: 'response_codes',
        types: [{
          type: 'integer',
          attributes: [],
        }, {
          type: 'string',
          attributes: [],
        }, {
          type: 'response_status',
          attributes: [],
        }],
        attributes: [],
      }],
      enums: [{
        name: 'response_status',
        plural: 'response_statuses',
        values: [
          { name: 'ok' },
        ],
        attributes: [],
      }],
    }));

    service.unions.forEach((union) => {
      const mock = mockUnion(union, {
        type: 'response_status',
      });
      expect(mock).toEqual({
        discriminator: 'response_status',
        value: 'ok',
      });
    });
  });

  test('takes into consideration the discriminator value specified in the union type schema', () => {
    const service = new apibuilder.ApiBuilderService(createApiBuilderServiceConfig({
      unions: [{
        name: 'response_code',
        plural: 'response_codes',
        types: [{
          discriminator_value: 'response_status',
          type: 'integer',
          attributes: [],
        }],
        attributes: [],
      }],
    }));

    service.unions.forEach((union) => {
      const mock = mockUnion(union);
      expect(mock).toEqual({
        discriminator: 'response_status',
        value: expect.any(Number),
      });
    });
  });

  test('takes into consideration discriminator key specified in the union schema', () => {
    const service = new apibuilder.ApiBuilderService(createApiBuilderServiceConfig({
      unions: [{
        discriminator: 'kind',
        name: 'response_code',
        plural: 'response_codes',
        types: [{
          type: 'integer',
          attributes: [],
        }],
        attributes: [],
      }],
    }));

    service.unions.forEach((union) => {
      const mock = mockUnion(union);
      expect(mock).toEqual({
        kind: 'integer',
        value: expect.any(Number),
      });
    });
  });

  test('takes into consideration discriminator key and value specified schema', () => {
    const service = new apibuilder.ApiBuilderService(createApiBuilderServiceConfig({
      unions: [{
        discriminator: 'kind',
        name: 'response_code',
        plural: 'response_codes',
        types: [{
          discriminator_value: 'response_status',
          type: 'integer',
          attributes: [],
        }],
        attributes: [],
      }],
    }));

    service.unions.forEach((union) => {
      const mock = mockUnion(union);
      expect(mock).toEqual({
        kind: 'response_status',
        value: expect.any(Number),
      });
    });
  });
});

describe('mockArray', () => {
  test('can mock array of string', () => {
    const fqn = new apibuilder.FullyQualifiedName('string');
    const primitive = new apibuilder.ApiBuilderPrimitiveType(fqn);
    const array = new apibuilder.ApiBuilderArray(primitive);
    const mock = mockArray(array);
    expect(mock).toEqual(expect.any(Array));
    mock.forEach((element) => {
      expect(element).toEqual(expect.any(String));
    });
  });

  test('can mock array of enum', () => {
    const service = new apibuilder.ApiBuilderService(createApiBuilderServiceConfig({
      enums: [{
        attributes: [],
        name: 'breed',
        plural: 'breeds',
        values: [
          { name: 'russian_blue' },
          { name: 'persian' },
          { name: 'siamese' },
          { name: 'maine_coon' },
        ],
      }],
    }));

    service.enums.forEach((enumeration) => {
      const array = new apibuilder.ApiBuilderArray(enumeration);
      const mock = mockArray(array);
      expect(mock).toEqual(expect.any(Array));
      mock.forEach((value) => {
        expect(enumeration.values.some((enumValue) => {
          return enumValue.name === value;
        })).toBe(true);
      });
    });
  });

  test('can mock array of model', () => {
    const service = new apibuilder.ApiBuilderService(createApiBuilderServiceConfig({
      models: [{
        name: 'pet',
        plural: 'pets',
        fields: [{
          name: 'name',
          type: 'string',
          attributes: [],
          required: true,
        }],
        attributes: [],
      }],
    }));

    service.models.forEach((model) => {
      const array = new apibuilder.ApiBuilderArray(model);
      const mock = mockArray(array);
      expect(mock).toEqual(expect.any(Array));
      mock.forEach((value) => {
        expect(value).toEqual(expect.objectContaining({
          name: expect.any(String),
        }));
      });
    });
  });

  test('does not generate nil values for array of enums without values', () => {
    const service = new apibuilder.ApiBuilderService(createApiBuilderServiceConfig({
      enums: [{
        name: 'breed',
        plural: 'breeds',
        values: [],
        attributes: [],
      }],
    }));

    service.enums.forEach((enumeration) => {
      const array = new apibuilder.ApiBuilderArray(enumeration);
      const mock = mockArray(array, { minimum: 1 });
      expect(mock).toEqual([]);
    });
  });
});

describe('mockMap', () => {
  test('can mock map of string', () => {
    const fqn = new apibuilder.FullyQualifiedName('string');
    const primitive = new apibuilder.ApiBuilderPrimitiveType(fqn);
    const map = new apibuilder.ApiBuilderMap(primitive);
    const mock = mockMap(map);
    expect(mock).toEqual(expect.any(Object));
    Object.keys(mock).forEach((key) => {
      const value = (mock as any)[key];
      expect(key).toEqual(expect.any(String));
      expect(value).toEqual(expect.any(String));
    });
  });

  test('can mock array of enum', () => {
    const service = new apibuilder.ApiBuilderService(createApiBuilderServiceConfig({
      enums: [{
        attributes: [],
        name: 'breed',
        plural: 'breeds',
        values: [
          { name: 'russian_blue' },
          { name: 'persian' },
          { name: 'siamese' },
          { name: 'maine_coon' },
        ],
      }],
    }));

    service.enums.forEach((enumeration) => {
      const map = new apibuilder.ApiBuilderMap(enumeration);
      const mock = mockMap(map);
      expect(mock).toEqual(expect.any(Object));
      Object.keys(mock).forEach((key) => {
        const value = (mock as any)[key];
        expect(key).toEqual(expect.any(String));
        expect(enumeration.values.some((enumValue) => {
          return enumValue.name === value;
        })).toBe(true);
      });
    });
  });
});
