import { type PageMetaDto } from '../../../../../common/dto/page-meta.dto';
import { type QuestionResDto } from '../../../../../modules/quiz/domains/dtos/responses/question.dto';

export class QuizResDto {
  questions: QuestionResDto[];

  meta: PageMetaDto;

  constructor(questions: QuestionResDto[], meta: PageMetaDto) {
    this.questions = questions;
    this.meta = meta;
  }
}
