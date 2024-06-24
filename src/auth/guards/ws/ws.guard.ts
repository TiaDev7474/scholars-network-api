import { CanActivate , ExecutionContext , Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { jwtConstants } from "../../constant";
import { WsException } from "@nestjs/websockets";

@Injectable()
export class WsGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient();
    const token = client.handshake.headers.authorization.split(' ')[1];
    if (!token) {
      throw new WsException('Unauthorized');
    }
    try {
      client.data.user = await this.jwtService.verifyAsync(token , {
        secret: jwtConstants.secret,
      }); // Attach the user information to the client object
      return true;
    } catch (e) {
      throw new WsException('ex.message');
    }
  }
}
