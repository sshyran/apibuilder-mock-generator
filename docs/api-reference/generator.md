# `Generator`

A class responsible for generating mock data based on apibuilder schema specifications.

## Methods

### `model(name: String, options: Object)`

This method generates the mock data for the model matching the specified name.

#### Arguments

1. `name` *(String)*: The name of the model to be generated.

2. `options` *(Object)*:): Options that can be used to configure the generator. The options are:

  - `useDefault` *(Boolean)*: This property holds whether the generator should use the field default values specified in the apibuilder schema when available. This rule only applies to fields that are not required. By default, this option is set to `false`.

  - `useExample` *(Boolean)*: This property holds whether the generator should use the field example values specified in the apibuilder scheme when available.

  - `onlyRequired` *(Boolean)*: This property holds whether the generator should generate mock data for required fields only. By default, this option is set to `false`.

  - `properties` *(Object)*: This property holds the values for the properties of the model being generated.

#### Returns

*(Object)*: The mock data for the model matching the specified name.

#### Example

```javascript
import { createMockGenerator, Generator } from 'apibuilder-mock-generator';
import schemaJson from './schema.json';

const generator: Generator = createMockGenerator(schemaJson);

generator.model('model');

generator.model('model', {
  onlyRequired: true,
});

generator.model('model', {
  onlyRequired: true,
  useDefault: true,
});

generator.model('model', {
  useExample: true,
});

generator.model('model', {
  properties: {
    fields: [
      generate.model('field', {
        name: 'name',
      }),
    ],
  },
});
```

#### Tips

- This method will throw an error when the specified name does not match a model.

- A fully qualified name can be use to narrow the search.

  ```javascript
  generator.model('io.apibuilder.spec.v0.models.model');
  ```


### `enum(name: String)`

This method generates the mock data for the enum matching the specified name.

#### Arguments

1. `name` *(String)*: The name of the enum to be generated.


#### Returns

*(String)* An enum value for the enum matching the specified name.

#### Example

```javascript
import { createMockGenerator, Generator } from 'apibuilder-mock-generator';
import schemaJson from './schema.json';

const generator: Generator = createMockGenerator(schemaJson);

generator.enum('method');
```

#### Tips

- This method will throw an error when the specified name does not match an enum.

- A fully qualified name can be use to narrow the search.

  ```javascript
  generator.enum('io.apibuilder.spec.v0.enums.method');
  ```

### `union(name: String, options: Object)`

This method generates the mock data for the union matching the specified name.

#### Arguments

1. `name` *(String)*: The name of the union to be generated.

2. `options` *(Object)*:): Options that can be used to configure the generator. The options are:

  - `type` *(String)*: This property holds the name of the union type to be generated.

  - `properties` *(Object)*: This property holds the values for the properties of the type being generated.

#### Returns

*(Any)* The mock data for one of the possible union types.

#### Example

```javascript
import { createMockGenerator, Generator } from 'apibuilder-mock-generator';
import schemaJson from './schema.json';

const generator: Generator = createMockGenerator(schemaJson);

generator.union('response_code');

generator.union('response_code', {
  type: 'response_code_option',
});

generator.union('response_code', {
  type: 'integer',
  properties: {
    value: 200,
  }
});
```

#### Tips

- This method will throw an error when the specified name does not match an union.

- A fully qualified name can be use to narrow the search.

  ```javascript
  generator.enum('io.apibuilder.spec.v0.unions.response_code');
  ```

