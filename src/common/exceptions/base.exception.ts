import { HttpException, HttpStatus } from '@nestjs/common';

export class BaseException extends HttpException {
  constructor(message: string, statusCode: HttpStatus, details?: Record<string, any>) {
    super(
      {
        success: false,
        statusCode,
        message,
        timestamp: new Date().toISOString(),
        ...(details && { details }),
      },
      statusCode,
    );
  }
}
