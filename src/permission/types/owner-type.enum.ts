import { registerEnumType } from '@nestjs/graphql';

export enum OwnerType {
  GROUP = 'group',
  USER = 'user',
}

registerEnumType(OwnerType, {
  name: 'OwnerType',
});
