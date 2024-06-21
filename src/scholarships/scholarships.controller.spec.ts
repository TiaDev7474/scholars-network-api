import { Test, TestingModule } from '@nestjs/testing';
import { ScholarshipsController } from './scholarships.controller';
import { ScholarshipsService } from './scholarships.service';

describe('ScholarshipsController', () => {
  let controller: ScholarshipsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScholarshipsController],
      providers: [ScholarshipsService],
    }).compile();

    controller = module.get<ScholarshipsController>(ScholarshipsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
