import { Module } from '@nestjs/common';
import { ScholarshipsService } from './scholarships.service';
import { ScholarshipsController } from './scholarships.controller';
import { ScholarshipsRepository } from './scholarships.repository';

@Module({
  controllers: [ScholarshipsController],
  providers: [ScholarshipsService, ScholarshipsRepository],
})
export class ScholarshipsModule {}
