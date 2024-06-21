import { StringFieldOptional } from '../../../../../decorators';

export class ProContentDto {
  @StringFieldOptional()
  name!: string;

  @StringFieldOptional()
  author!: string;

  @StringFieldOptional()
  img!: string;

  constructor(name: string, author: string, img: string) {
    this.name = name;
    this.author = author;
    this.img = img;
  }
}
