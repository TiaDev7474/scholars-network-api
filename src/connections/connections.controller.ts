import { Controller, Get, Post, Body, Patch, Query } from '@nestjs/common';
import { ConnectionsService } from './connections.service';
import { CreateConnectionDto } from './dto/create-connection.dto';
import { GetUser } from '../common/decorators/user.decorator';
import { RequestResponseDto } from './dto/request-response.dto';

@Controller('connections')
export class ConnectionsController {
  constructor(private readonly connectionsService: ConnectionsService) {}

  @Post('/request')
  create(
    @GetUser() user: any,
    @Body() createConnectionDto: CreateConnectionDto,
  ) {
    console.log(user, createConnectionDto);
    return this.connectionsService.sendConnectionRequest({
      senderId: user.sub,
      receiverId: createConnectionDto.receiverId,
    });
  }
  @Patch('reply')
  async acceptOrDeclineRequest(
    @Body() requestResponseDto: RequestResponseDto,
    @GetUser() user: any,
  ) {
    return this.connectionsService.acceptOrDeclineRequest({
      receiverId: user.sub,
      senderId: requestResponseDto.senderId,
      action: requestResponseDto.action,
    });
  }
  @Get('request/sent')
  async getSentRequest(
    @GetUser() user: any,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.connectionsService.getSentRequests({
      page,
      limit,
      userId: user.sub,
    });
  }
  @Get('request/received')
  async getReceivedRequest(
    @GetUser() user: any,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.connectionsService.getReceivedRequests({
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 10,
      userId: user.sub,
    });
  }
  @Get()
  async getUserConnections(
    @GetUser() user: any,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.connectionsService.getUsersConnections({
      page,
      limit,
      userId: user.sub,
    });
  }
}
