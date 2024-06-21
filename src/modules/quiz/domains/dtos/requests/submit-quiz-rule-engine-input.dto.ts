import { BooleanFieldOptional, StringFieldOptional } from '../../../../../decorators';

export class SubmitQuizDto {
  @StringFieldOptional()
  questionId!: string;

  @StringFieldOptional()
  optionId!: string;

  @StringFieldOptional()
  proStrengthId!: string;

  @StringFieldOptional()
  proStrengthName!: string;

  @StringFieldOptional()
  quizType!: string;

  @BooleanFieldOptional()
  isCorrected!: boolean;
}
