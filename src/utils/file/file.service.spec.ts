import { Test, TestingModule } from '@nestjs/testing';
import { FileService } from './file.service';

describe('FileService', () => {
  let service: FileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FileService],
    }).compile();

    service = module.get<FileService>(FileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('bufferToBase64String', () => {
    it('Should return the respective base64 encoded string', () => {
      const buffer = Buffer.from('Hello world!');
      const base64String = 'SGVsbG8gd29ybGQh';
      const result = service.bufferToBase64(buffer);
      expect(result).toEqual(base64String);
    });
  });

  describe('base64StringToBuffer', () => {
    it('should return the respective buffer from a base64 string', () => {
      const base64String = 'SGVsbG8gd29ybGQh';
      const result = service.base64ToBuffer(base64String);
      const buffer = Buffer.from('Hello world!');
      expect(result).toEqual(buffer);
    });
  });
});
