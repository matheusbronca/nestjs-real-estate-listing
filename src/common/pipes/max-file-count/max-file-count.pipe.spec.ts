import { BadRequestException } from '@nestjs/common';
import { MaxFileCountPipe } from './max-file-count.pipe';

describe('MaxFileCountPipe', () => {
  let maxFileCountPipe: MaxFileCountPipe;

  beforeEach(() => {
    maxFileCountPipe = new MaxFileCountPipe(2);
  });

  it('should be defined', () => {
    expect(maxFileCountPipe).toBeDefined();
  });

  it('should return badRequest if the number of files is greater than the maxCount', () => {
    const file = {} as Express.Multer.File;
    const result = () => maxFileCountPipe.transform([file, file, file]);
    expect(result).toThrow(BadRequestException);
  });

  it('should return the files passed in when the count is less than the maxCount', () => {
    const file = {} as Express.Multer.File;
    const result = maxFileCountPipe.transform([file]);
    expect(result).toEqual([{}]);
  });

  it('should return the files passed in when the count is the same as the maxCount', () => {
    const file = {} as Express.Multer.File;
    const result = maxFileCountPipe.transform([file, file]);
    expect(result).toEqual([{}, {}]);
  });
});
