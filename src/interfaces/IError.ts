import { ErrorCodeEnum } from "common/dto/error-code";

export interface IError {
  error: string | undefined;
  errorCode?: ErrorCodeEnum;

  message: string;
}
