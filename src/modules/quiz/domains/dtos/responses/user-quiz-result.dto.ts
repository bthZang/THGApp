import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';

import { AbstractDto } from '../../../../../common/dto/abstract.dto';
import { UserDto } from '../../../../../modules/user/domains/dtos/user.dto';
import { QuizEntity } from '../../entities/quiz.entity';
import { ProTypeDto } from './pro-type.dto';
import { QuizStrengthDto } from './user-quiz-strength.dto';

export class QuizDto extends AbstractDto {
  @ValidateNested({ each: true })
  @Type(() => ProTypeDto)
  proType: ProTypeDto;

  @ValidateNested({ each: true })
  @Type(() => UserDto)
  user: UserDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuizStrengthDto)
  quizStrengths?: QuizStrengthDto[];

  constructor(quiz: QuizEntity) {
    super(quiz);
    this.proType = new ProTypeDto(quiz.proType);
    this.quizStrengths = quiz.quizResultStrengths.map((quizStrength) => new QuizStrengthDto(quizStrength));
    this.user = new UserDto(quiz.user);
  }
}
