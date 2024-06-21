import { SetMetadata } from '@nestjs/common';

export const RESPONSE_MESSAGE = 'response_message';
// eslint-disable-next-line @typescript-eslint/naming-convention
export const ResponseMessage = (message: string) => SetMetadata(RESPONSE_MESSAGE, message);
