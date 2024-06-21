import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ProStrengthEntity } from '../domains/entities/pro-strength.entity';
import { ProTypeEntity } from '../domains/entities/pro-type.entity';
import { QuizEntity } from '../domains/entities/quiz.entity';
import { QuizResultStrengthEntity } from '../domains/entities/quiz-result-strength.entity';
import { ResultImageEntity } from '../domains/entities/result-image.entity';

export interface IQuizRepository {
  createQuizResult(
    userId: string | null,
    type: ProTypeEntity,
    imgKey: string,
    strengths: ProStrengthEntity[],
  ): Promise<QuizEntity | null>;
  findByUserId(userId: string): Promise<QuizEntity | null>;
  createStrengthsResult(quizId: string, strengths: ProStrengthEntity[]): Promise<QuizResultStrengthEntity[]>;
  findResultImageByKey(key: string): Promise<ResultImageEntity | null>;
  createResultImage(key: string): Promise<ResultImageEntity>;
}

@Injectable()
export class QuizRepository implements IQuizRepository {
  constructor(
    @InjectRepository(QuizEntity)
    private quizRepository: Repository<QuizEntity>,

    @InjectRepository(QuizResultStrengthEntity)
    private quizResultStrengthRepository: Repository<QuizResultStrengthEntity>,

    @InjectRepository(ResultImageEntity)
    private resultImageRepository: Repository<ResultImageEntity>,
  ) {}

  public async findByUserId(userId: string): Promise<QuizEntity | null> {
    return this.quizRepository.findOne({
      where: {
        user: {
          id: userId,
        },
      },
    });
  }

  public async createResultImage(key: string): Promise<ResultImageEntity> {
    return this.resultImageRepository.save({
      imgKey: key,
    });
  }

  public async findResultImageByKey(key: string): Promise<ResultImageEntity | null> {
    return this.resultImageRepository.findOne({
      where: {
        imgKey: key,
      },
    });
  }

  public async createQuizResult(
    userId: string,
    type: ProTypeEntity,
    imgKey: string,
    strengths: ProStrengthEntity[],
  ): Promise<QuizEntity | null> {
    const result = await this.quizRepository.save({
      user: { id: userId },
      proType: type,
      imgKey,
    });

    await this.createStrengthsResult(result.id, strengths);

    return result;
  }

  public async createStrengthsResult(
    quizId: string,
    strengths: ProStrengthEntity[],
  ): Promise<QuizResultStrengthEntity[]> {
    const resultPromises = strengths.map((strength) =>
      this.quizResultStrengthRepository.save({
        quiz: { id: quizId },
        proStrength: strength,
      }),
    );

    const results = await Promise.all(resultPromises);

    return results;
  }
}
