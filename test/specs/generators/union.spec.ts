import { createMockGenerator } from '../../../src/index';
import { createApiBuilderServiceConfig } from '../../helpers/apibuilder';

describe('union generator', () => {
  test('can generate primitive union types', () => {
    const schema = createApiBuilderServiceConfig({
      unions: [{
        name: 'response_code',
        plural: 'response_codes',
        types: [{
          type: 'integer',
          attributes: [],
        }],
        attributes: [],
      }],
    });
    const generator = createMockGenerator(schema);
    const mock = generator.union('response_code');
    expect(mock).toEqual({
      discriminator: 'integer',
      value: expect.any(Number),
    });
  });

  test('can generate enum union types', () => {
    const schema = createApiBuilderServiceConfig({
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
    });
    const generator = createMockGenerator(schema);
    const mock = generator.union('response_code');
    expect(mock).toEqual({
      discriminator: 'response_code_option',
      value: 'default',
    });
  });

  test('can generate model union types', () => {
    const schema = createApiBuilderServiceConfig({
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
    });
    const generator = createMockGenerator(schema);
    const mock = generator.union('diff');
    expect(mock).toEqual({
      discriminator: 'diff_breaking',
      description: expect.any(String),
    });
  });

  test('allows selection of union type to be generated', () => {
    const schema = createApiBuilderServiceConfig({
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
    });
    const generator = createMockGenerator(schema);
    const mock = generator.union('response_code', {
      type: 'response_status',
    });
    expect(mock).toEqual({
      discriminator: 'response_status',
      value: 'ok',
    });
  });

  test('takes into consideration the discriminator value specified in the union type schema', () => {
    const schema = createApiBuilderServiceConfig({
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
    });
    const generator = createMockGenerator(schema);
    const mock = generator.union('response_code');
    expect(mock).toEqual({
      discriminator: 'response_status',
      value: expect.any(Number),
    });
  });

  test('takes into consideration discriminator key specified in the union schema', () => {
    const schema = createApiBuilderServiceConfig({
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
    });
    const generator = createMockGenerator(schema);
    const mock = generator.union('response_code');
    expect(mock).toEqual({
      kind: 'integer',
      value: expect.any(Number),
    });
  });

  test('takes into consideration discriminator key and value specified schema', () => {
    const schema = createApiBuilderServiceConfig({
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
    });
    const generator = createMockGenerator(schema);
    const mock = generator.union('response_code');
    expect(mock).toEqual({
      kind: 'response_status',
      value: expect.any(Number),
    });
  });
});

