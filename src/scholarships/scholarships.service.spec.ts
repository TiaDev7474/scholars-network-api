import { Test, TestingModule } from '@nestjs/testing';
import { ScholarshipsService } from './scholarships.service';

describe('ScholarshipsService', () => {
  let service: ScholarshipsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScholarshipsService],
    }).compile();

    service = module.get<ScholarshipsService>(ScholarshipsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
