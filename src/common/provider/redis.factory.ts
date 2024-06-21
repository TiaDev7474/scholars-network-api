import { FactoryProvider } from '@nestjs/common';
import Redis from 'ioredis';
import * as process from 'process';

export const RedisFactoryProvider: FactoryProvider<any> = {
  provide: 'REDIS_CLIENT',
  useFactory: () => {
    const redisInstance = new Redis({
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT),
    });

    redisInstance.on('error', (e) => {
      throw new Error(`Redis connection failed: ${e}`);
    });
    return redisInstance;
  },
};
