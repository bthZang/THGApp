import { ApiProperty } from '@nestjs/swagger';

export class BaseMessageResponseDto {
  @ApiProperty({ type: String, description: 'The message of the response' })
  message?: string;

  @ApiProperty({
    name: 'errorCode',
    description: 'The error code of the response',
  })
  error?: string;

  constructor(error?: string, message?: string) {
    this.message = message;
    this.error = error;
  }
}
