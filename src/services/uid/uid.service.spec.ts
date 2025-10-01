import { Test, TestingModule } from '@nestjs/testing';
import { UidService } from './uid.service';

describe('UidService', () => {
  let service: UidService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UidService],
    }).compile();
    service = module.get<UidService>(UidService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a UID of default length when no length is provided', () => {
    const uid = service.generate();
    expect(typeof uid).toBe('string');
    expect(uid.length).toBe(21);
  });

  it('should return a UID of specified length', () => {
    const uid = service.generate(5);
    expect(uid.length).toBe(5);
  });
});
