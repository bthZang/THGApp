import { BooleanField, StringField } from '../../../../../decorators';
import { OptionEntity } from '../../../../../modules/quiz/domains/entities/option.entity';

export class OptionResDto {
  @StringField()
  id: string;

  @StringField()
  answer: string;

  @BooleanField()
  isCorrect: boolean;

  constructor(option: OptionEntity) {
    this.id = option.id;
    this.answer = option.answer;
    this.isCorrect = option.isCorrect;
  }
}
