import { Module } from '@nestjs/common';
import { ConnectionsService } from './connections.service';
import { ConnectionsController } from './connections.controller';
import { ConnectionsRepository } from './connections.repository';

@Module({
  controllers: [ConnectionsController],
  providers: [ConnectionsService, ConnectionsRepository],
})
export class ConnectionsModule {}
