import { Injectable } from '@nestjs/common';
import { UploadFileInput } from './dto/upload-file.input';
import { UpdateFileInput } from './dto/update-file.input';

@Injectable()
export class FileService {
  create(createFileInput: UploadFileInput) {
    return 'This action adds a new file';
  }

  findAll() {
    return `This action returns all file`;
  }

  findOne(id: number) {
    return `This action returns a #${id} file`;
  }

  update(id: number, updateFileInput: UpdateFileInput) {
    return `This action updates a #${id} file`;
  }

  remove(id: number) {
    return `This action removes a #${id} file`;
  }
}
