import { PageOptionsDto } from '../../../../../common/dto/page-options.dto';
import { QuizType } from '../../../../../constants';
import { EnumField } from '../../../../../decorators';

export class FindQuestionsDto extends PageOptionsDto {
  @EnumField(() => QuizType, {
    default: QuizType.PERSONALITY,
  })
  type!: QuizType;
}
