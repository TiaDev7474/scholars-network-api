import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from '../../constant';
@Injectable()
export class WsGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client: Socket = context.switchToWs().getClient<Socket>();
    const token = client.handshake.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      context.switchToWs().getData().user = await this.jwtService.verifyAsync(
        token,
        {
          secret: jwtConstants.secret,
        },
      );
    } catch (e) {
      throw new UnauthorizedException();
    }
    return true;
  }
}
