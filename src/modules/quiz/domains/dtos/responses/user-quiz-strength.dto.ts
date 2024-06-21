import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

import { AbstractDto } from '../../../../../common/dto/abstract.dto';
import { QuizResultStrengthEntity } from '../../entities/quiz-result-strength.entity';
import { ProStrengthDto } from './pro-strength.dto';
import { QuizDto } from './user-quiz-result.dto';

export class QuizStrengthDto extends AbstractDto {
  @ValidateNested({ each: true })
  @Type(() => QuizDto)
  quiz: QuizDto;

  @ValidateNested({ each: true })
  @Type(() => ProStrengthDto)
  proStrengths: ProStrengthDto;

  constructor(quizStrength: QuizResultStrengthEntity) {
    super(quizStrength);
    this.quiz = new QuizDto(quizStrength.quiz);
    this.proStrengths = new ProStrengthDto(quizStrength.proStrength);
  }
}
