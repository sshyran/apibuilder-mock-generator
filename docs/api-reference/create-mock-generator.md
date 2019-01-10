# `createMockGenerator(schema)`

Creates a mock data generator for the specified apibuilder schema.

#### Arguments

1. `schema` *(Object)*: An object that conforms to the [apibuilder schema specifications](https://app.apibuilder.io/doc/apiJson).

#### Returns

([*`Generator`*](./generator.md)): An instance of the apibuilder mock data generator.

#### Example

```js
import { createMockGenerator } from 'apibuilder-mock-generator';
import schemaJson from './schema.json';

const generator = createMockGenerator(schemaJson);
```
