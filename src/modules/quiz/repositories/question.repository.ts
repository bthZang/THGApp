import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PageDto } from '../../../common/dto/page.dto';
import { PageMetaDto } from '../../../common/dto/page-meta.dto';
import { QuizType } from '../../../constants';
import { FindQuestionsDto } from '../domains/dtos/requests/find-questions.dto';
import { QuestionEntity } from '../domains/entities/question.entity';

export interface IQuestionRepository {
  findById(id: string): Promise<QuestionEntity | null>;
  findByType(type: QuizType): Promise<QuestionEntity[] | null>;
  findQuestions(findQuestionsDto: FindQuestionsDto): Promise<PageDto<QuestionEntity>>;
}

@Injectable()
export class QuestionRepository implements IQuestionRepository {
  constructor(
    @InjectRepository(QuestionEntity)
    private questionRepository: Repository<QuestionEntity>,
  ) {}

  async findById(id: string): Promise<QuestionEntity | null> {
    return this.questionRepository.findOne({
      where: {
        id,
      },
      relations: {
        proStrength: true,
      },
    });
  }

  async findByType(type: QuizType): Promise<QuestionEntity[] | null> {
    return this.questionRepository.find({
      where: {
        quizType: type,
      },
    });
  }

  async findQuestions(findQuestionsDto: FindQuestionsDto): Promise<PageDto<QuestionEntity>> {
    const { skip, take, type } = findQuestionsDto;

    const queryBuilder = this.questionRepository.createQueryBuilder('questions');

    queryBuilder
      .leftJoinAndSelect('questions.options', 'options')
      .where('questions.quizType = :type', { type })
      .skip(skip)
      .take(take);

    const [entities, itemCount] = await queryBuilder.getManyAndCount();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto: findQuestionsDto });

    return new PageDto(entities, pageMetaDto);
  }
}
