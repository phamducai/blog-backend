import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base.exception';

export class NotFoundException extends BaseException {
  constructor(entity: string, id?: string, details?: Record<string, any>) {
    const message = id 
      ? `${entity} with ID ${id} not found` 
      : `${entity} not found`;
    super(message, HttpStatus.NOT_FOUND, details);
  }
}
