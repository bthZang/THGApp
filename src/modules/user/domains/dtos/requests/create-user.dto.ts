import { DateFieldOptional, NumberFieldOptional, StringFieldOptional } from '../../../../../decorators';
import { GoogleAccount } from '../../../../../modules/auth/domains/dtos/requests/google.dto';

export class CreateUserDto {
  @StringFieldOptional({ nullable: true })
  fullName!: string | null;

  @StringFieldOptional({ nullable: true })
  email!: string | null;

  @StringFieldOptional({ nullable: true })
  avatar!: string | null;

  @StringFieldOptional({ nullable: true, default: '' })
  cover_picture?: string | null;

  @StringFieldOptional({ nullable: true, default: '' })
  phone?: string | null;

  @StringFieldOptional({ nullable: true, default: '' })
  gender?: string | null;

  @DateFieldOptional({ nullable: true, default: '' })
  birthday?: Date | null;

  @StringFieldOptional({ nullable: true, default: '' })
  location?: Date | null;

  @StringFieldOptional({ nullable: true, default: '' })
  social_link?: string | null;

  @StringFieldOptional({ nullable: true, default: '' })
  university?: string | null;

  @StringFieldOptional({ nullable: true, default: '' })
  major?: string | null;

  @NumberFieldOptional({ nullable: true, default: '' })
  gpa?: string | null;

  constructor(googleAccount: GoogleAccount) {
    this.fullName = googleAccount.fullName;
    this.email = googleAccount.email;
    this.avatar = googleAccount.avatar;
  }
}
