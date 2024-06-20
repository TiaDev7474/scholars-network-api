import { Controller, Get } from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Get('/:id')
  async say() {
    return 'users';
  }
}
