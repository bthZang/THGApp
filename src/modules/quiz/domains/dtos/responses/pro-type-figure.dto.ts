import { StringFieldOptional } from '../../../../../decorators';

export class ProFigureDto {
  @StringFieldOptional()
  name!: string;

  @StringFieldOptional()
  title!: string;

  constructor(name: string, title: string) {
    this.name = name;
    this.title = title;
  }
}
