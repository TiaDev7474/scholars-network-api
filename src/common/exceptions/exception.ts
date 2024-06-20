import { HttpException, HttpStatus } from '@nestjs/common';

export class EmailAlreadyInUseException extends HttpException {
  constructor() {
    super('Email already in use', HttpStatus.CONFLICT);
  }
}
export class DatabaseException extends HttpException {
  constructor(error: Error) {
    super(
      `Database operation failed, ${error}`,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}

export class UserNotFoundException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.NOT_FOUND);
  }
}
