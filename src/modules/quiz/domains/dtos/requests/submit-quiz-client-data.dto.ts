import { IsObject } from 'class-validator';

import { QuizType } from '../../../../../constants/quiz-type';
import { EnumField, StringField } from '../../../../../decorators';
import { OptionResDto } from '../responses/option.dto';

export class SubmitRequestDto {
  @StringField()
  questionId!: string;

  @EnumField(() => QuizType, {
    default: QuizType.PERSONALITY,
  })
  quizType!: QuizType;

  @IsObject()
  option!: OptionResDto;
}
