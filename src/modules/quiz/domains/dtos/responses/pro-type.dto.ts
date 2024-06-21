import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';

import { AbstractDto } from '../../../../../common/dto/abstract.dto';
import { StringFieldOptional } from '../../../../../decorators';
import { IValue, ProTypeEntity } from '../../entities/pro-type.entity';
import { ProContentDto } from './pro-type-content.dto';
import { ProFigureDto } from './pro-type-figure.dto';

export class ProTypeDto extends AbstractDto {
  @StringFieldOptional()
  name!: string;

  @StringFieldOptional()
  description!: string;

  @StringFieldOptional()
  improvement!: string;

  @StringFieldOptional()
  imgStrength!: string;

  @StringFieldOptional()
  imgType!: string;

  values!: IValue;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProFigureDto)
  figure!: ProFigureDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProContentDto)
  content!: ProContentDto[];

  constructor(proType: ProTypeEntity) {
    super(proType);
    this.name = proType.name;
    this.description = proType.description;
    this.improvement = proType.improvement;
    this.imgStrength = proType.imgStrength;
    this.imgType = proType.imgType;
    this.figure = proType.figure;
    this.content = proType.content;
    this.values = proType.values;
  }
}
