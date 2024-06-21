import { FactoryProvider } from '@nestjs/common';
import * as Minio from 'minio';
import { ConfigService } from '@nestjs/config';

export const MinioFactory: FactoryProvider = {
  provide: 'MINIO_CLIENT',
  useFactory: (configService: ConfigService) => {
    return new Minio.Client({
      endPoint: configService.get('MINIO_ENDPOINT'),
      port: Number(configService.get('MINIO_PORT')),
      useSSL: configService.get('MINIO_USE_SSL') === 'true',
      accessKey: configService.get('MINIO_ACCESS_KEY'),
      secretKey: configService.get('MINIO_SECRET_KEY'),
    });
  },
  inject: [ConfigService],
};
