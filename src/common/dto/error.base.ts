import { BadRequestException } from '@nestjs/common';

import { IError } from 'interfaces/IError';
import type { ErrorCodeEnum } from './error-code';

export class BaseError extends Error implements IError {
  errorCode?: ErrorCodeEnum;

  error: string | undefined;

  stack?: string;

  constructor(msg: string, errorCode?: ErrorCodeEnum) {
    super(msg);
    this.errorCode = errorCode;
    this.message = msg;
  }
}

export class ValidationException extends BadRequestException { }
