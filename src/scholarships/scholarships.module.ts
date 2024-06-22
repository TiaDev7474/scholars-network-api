import { Module } from '@nestjs/common';
import { ScholarshipsService } from './scholarships.service';
import { ScholarshipsController } from './scholarships.controller';
import { ScholarshipsRepository } from './scholarships.repository';
import { MinioModule } from '../common/lib/minio/minio.module';

@Module({
  imports: [MinioModule],
  controllers: [ScholarshipsController],
  providers: [ScholarshipsService, ScholarshipsRepository],
})
export class ScholarshipsModule {}
