import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class MaxFileCountPipe implements PipeTransform {
  constructor(private readonly maxCount: number) {}

  transform(files: Express.Multer.File[]) {
    if (files.length > this.maxCount) {
      throw new BadRequestException(
        `Maximum ${this.maxCount} files allowed. You uploaded ${files.length} files.`,
      );
    }
    return files;
  }
}
