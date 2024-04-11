import { UploadFileInput } from './upload-file.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateFileInput extends PartialType(UploadFileInput) {
  @Field(() => Int)
  id: number;
}
