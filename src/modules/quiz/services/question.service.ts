import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';

import { PageDto } from '../../../common/dto/page.dto';
import { FindQuestionsDto } from '../../../modules/quiz/domains/dtos/requests/find-questions.dto';
import { QuestionEntity } from '../../../modules/quiz/domains/entities/question.entity';
import { IQuestionRepository } from '../../../modules/quiz/repositories/question.repository';

export interface IQuestionService {
  findQuestions(findQuetionsDto: FindQuestionsDto): Promise<PageDto<QuestionEntity>>;
  findQuestionsById(questionId: string): Promise<QuestionEntity>;
}
@Injectable()
export class QuestionService implements IQuestionService {
  public logger: Logger;

  constructor(
    @Inject('IQuestionRepository')
    public readonly questionRepository: IQuestionRepository,
  ) {
    this.logger = new Logger(QuestionService.name);
  }

  async findQuestions(findQuetionsDto: FindQuestionsDto): Promise<PageDto<QuestionEntity>> {
    const result = await this.questionRepository.findQuestions(findQuetionsDto);

    return result;
  }

  async findQuestionsById(questionId: string): Promise<QuestionEntity> {
    const result = await this.questionRepository.findById(questionId);

    if (!result) {
      throw new NotFoundException(`Question is not found with id ${questionId}`);
    }

    return result;
  }
}
