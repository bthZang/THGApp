import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

import { StringField } from '../../../../../decorators';
import { OptionResDto } from '../../../../../modules/quiz/domains/dtos/responses/option.dto';

export class QuestionResDto {
  @StringField()
  id: string;

  @StringField()
  question: string;

  @StringField()
  quizType: string;

  @StringField()
  img: string;

  @IsArray()
  @ApiProperty({ description: 'options', type: [OptionResDto] })
  options: OptionResDto[];

  constructor(questions: QuestionResDto) {
    this.id = questions.id;
    this.question = questions.question;
    this.quizType = questions.quizType;
    this.img = questions.img;
    this.options = questions.options;
  }
}
