import { registerEnumType } from '@nestjs/graphql';

export enum ModelType {
  TYPE = 'type',
  OBJECT = 'object',
}

registerEnumType(ModelType, {
  name: 'ModelType',
});
