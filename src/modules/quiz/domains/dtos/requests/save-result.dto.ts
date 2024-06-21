import { StringFieldOptional } from '../../../../../decorators';

export class SaveResultDto {
  @StringFieldOptional()
  cachedId!: string;

  @StringFieldOptional()
  s3Key!: string;

  @StringFieldOptional()
  userId!: string;
}
