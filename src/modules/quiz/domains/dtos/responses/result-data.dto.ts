import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsString, ValidateNested } from 'class-validator';

import { StringFieldOptional } from '../../../../../decorators';
import { IValue } from '../../entities/pro-type.entity';
import { ProContentDto } from './pro-type-content.dto';
import { ProFigureDto } from './pro-type-figure.dto';

class TypeData {
  @StringFieldOptional()
  name!: string;

  @StringFieldOptional()
  description!: string;

  @StringFieldOptional()
  imgType!: string;

  @StringFieldOptional()
  imgStrength!: string;

  @StringFieldOptional()
  improvement!: string;
}

export class ResultDataDto {
  type: TypeData;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProContentDto)
  contents: ProContentDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProFigureDto)
  figures: ProFigureDto[];

  @ValidateNested()
  values: string[];

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  strengths: string[];

  constructor(type: TypeData, contents: ProContentDto[], figures: ProFigureDto[], values: IValue, strengths: string[]) {
    this.type = type;
    this.contents = contents;
    this.figures = figures;
    this.values = Object.values(values).filter((value): value is string => typeof value === 'string');
    this.strengths = strengths;
  }
}
