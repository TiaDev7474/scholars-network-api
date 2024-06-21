import { Module } from '@nestjs/common';
import { MinioService } from './minio.service';
import { MinioFactory } from '../../provider/minio.factory';

@Module({
  providers: [MinioService, MinioFactory],
  exports: [MinioService],
})
export class MinioModule {}
