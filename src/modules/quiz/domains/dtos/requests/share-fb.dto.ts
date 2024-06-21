import { StringFieldOptional } from '../../../../../decorators';

export class ShareFacebookDto {
  @StringFieldOptional()
  badgeImage!: string;
}
