import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Cache } from 'cache-manager';

import { PageDto } from '../../../common/dto/page.dto';
import { FindQuestionsDto } from '../../../modules/quiz/domains/dtos/requests/find-questions.dto';
import { OptionResDto } from '../../../modules/quiz/domains/dtos/responses/option.dto';
import { QuestionResDto } from '../../../modules/quiz/domains/dtos/responses/question.dto';
import { QuizResDto } from '../../../modules/quiz/domains/dtos/responses/quiz-response.dto';
import { OptionEntity } from '../../../modules/quiz/domains/entities/option.entity';
import { QuestionEntity } from '../../../modules/quiz/domains/entities/question.entity';
import { ApiConfigService } from '../../../shared/services/api-config.service';
import { IAwsS3Service } from '../../../shared/services/aws-s3.service';
import { GeneratorService } from '../../../shared/services/generator.service';
import { IMustacheService } from '../../../shared/services/mustache.service';
import { IPuppeteerService } from '../../../shared/services/pupeeteer.service';
import { SaveResultDto } from '../domains/dtos/requests/save-result.dto';
import { ShareFacebookDto } from '../domains/dtos/requests/share-fb.dto';
import { SubmitRequestDto } from '../domains/dtos/requests/submit-quiz-client-data.dto';
import { SubmitQuizDto } from '../domains/dtos/requests/submit-quiz-rule-engine-input.dto';
import { ResultDataDto } from '../domains/dtos/responses/result-data.dto';
import { ResultResponseDto } from '../domains/dtos/responses/result-data-response.dto';
import { ProStrengthEntity } from '../domains/entities/pro-strength.entity';
import { QuizEntity } from '../domains/entities/quiz.entity';
import { IQuizRepository } from '../repositories/quiz.repository';
import { IProStrengthService } from '../services/pro-strength.service';
import { IProTypeService } from '../services/pro-type.service';
import { IQuestionService } from '../services/question.service';
import { IRuleService } from './rule.service';

export interface IQuizService {
  uploadImage(file: Express.Multer.File): Promise<string>;
  viewImage(imageId: string): string;
  saveQuizResultData(saveResultDto): Promise<QuizEntity>;
  getQuiz(findQuetionsDto: FindQuestionsDto): Promise<QuizResDto>;
  submitQuiz(data: SubmitRequestDto[]): Promise<ResultResponseDto>;
  renderHTMLResult(id: string): Promise<string>;
  renderHTMLSharing(imageId: string): Promise<string>;
}

@Injectable()
export class QuizService implements IQuizService {
  public logger: Logger;

  constructor(
    @Inject('IQuestionService')
    public readonly questionService: IQuestionService,
    @Inject('IQuizRepository')
    public readonly quizRepository: IQuizRepository,
    @Inject('IProTypeService')
    public readonly proTypeService: IProTypeService,
    @Inject('IProStrengthService')
    public readonly proStrengthService: IProStrengthService,
    @Inject('IAwsS3Service')
    private readonly s3Service: IAwsS3Service,
    @Inject('IMustacheService')
    private readonly mustacheService: IMustacheService,
    @Inject('IRuleService')
    private readonly ruleEngineService: IRuleService,
    @Inject('IPuppeteerService')
    private readonly puppeteerService: IPuppeteerService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    private generatorService: GeneratorService,
    private readonly apiConfigService: ApiConfigService,
  ) {
    this.logger = new Logger(QuizService.name);
  }

  viewImage(imageId: string): string {
    const imageUrl = this.s3Service.getImageUrl(imageId);

    return imageUrl;
  }

  async uploadImage(file: Express.Multer.File): Promise<string> {
    const imageKey = await this.s3Service.uploadImage(file, 'quiz-images');

    const imageId = encodeURIComponent(imageKey);

    return imageId;
  }

  async getQuiz(findQuetionsDto: FindQuestionsDto): Promise<QuizResDto> {
    const questions: PageDto<QuestionEntity> = await this.questionService.findQuestions(findQuetionsDto);

    const newQuiz = questions.data.map(
      (q: QuestionEntity) =>
        new QuestionResDto({
          id: q.id,
          question: q.question,
          quizType: q.quizType,
          img: this.s3Service.getImageUrl(q.img),
          options: q.options.map((o: OptionEntity) => new OptionResDto(o)),
        }),
    );

    return new QuizResDto(newQuiz, questions.meta);
  }

  public async submitQuiz(data: SubmitRequestDto[]): Promise<ResultResponseDto> {
    try {
      if (data.length === 0) {
        throw new BadRequestException(`Complete the Quiz to see the results`);
      }

      const ruleEngineInputData = await Promise.all(
        data.map(async (submitRequest) => {
          const result = new SubmitQuizDto();
          result.questionId = submitRequest.questionId;
          result.optionId = submitRequest.option.id;
          result.quizType = submitRequest.quizType;
          result.isCorrected = submitRequest.option.isCorrect;

          const questionMapping = await this.questionService.findQuestionsById(submitRequest.questionId);
          result.proStrengthId = questionMapping.proStrength.id;
          result.proStrengthName = questionMapping.proStrength.name;

          return result;
        }),
      );

      const quizResult = await this.ruleEngineService.handleRuleEngineOutput(ruleEngineInputData);
      const generatedKey = this.generatorService.uuid();
      await this.cacheManager.set(generatedKey, quizResult);
      const imageId = await this.puppeteerService.getImage(this.apiConfigService.imageIdGetterUrl + generatedKey);
      await this.quizRepository.createResultImage(imageId);
      const imageUrl = this.s3Service.getImageUrl(imageId);

      return new ResultResponseDto(imageUrl, imageId, generatedKey);
    } catch (rawError) {
      this.logger.error(`Failed when caculating result for Quiz ${rawError}`);

      const error = rawError instanceof BadRequestException ? rawError : new InternalServerErrorException(rawError);

      throw error;
    }
  }

  public async saveQuizResultData(saveResult: SaveResultDto): Promise<QuizEntity> {
    if (!saveResult.cachedId) {
      throw new NotFoundException(`Cache id not found at ${saveResult.cachedId}`);
    }

    if (!saveResult.s3Key) {
      throw new NotFoundException(`S3 key not found at ${saveResult.s3Key}`);
    }

    const data = (await this.cacheManager.get(saveResult.cachedId)) as ResultDataDto;
    const typeName = data.type.name;
    const strengthsNames = data.strengths;
    const typeEntity = await this.proTypeService.findProTypeByName(typeName);

    const strengthsEntities: ProStrengthEntity[] = [];
    const strengthPromises = strengthsNames.map(async (strength) => {
      const strengthEntity = await this.proStrengthService.findByName(strength);
      strengthsEntities.push(strengthEntity);
    });

    await Promise.all(strengthPromises);
    const result = await this.quizRepository.createQuizResult(
      saveResult.userId,
      typeEntity,
      saveResult.s3Key,
      strengthsEntities,
    );

    if (!result) {
      throw new BadRequestException('Cannot create result');
    }

    return result;
  }

  public async renderHTMLResult(id: string): Promise<string> {
    try {
      const data = await this.cacheManager.get(id);

      if (!data) {
        throw new NotFoundException(`Data not found for id: ${id}`);
      }

      const template = 'quiz-result.mustache';
      const htmlContent = await this.mustacheService.renderHTMLResult(template, data as ResultDataDto);

      return htmlContent;
    } catch (error) {
      this.logger.error(`Failed to render HTML result for id: ${id}`, error);

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(`Internal server error while rendering HTML result for id: ${id}`);
    }
  }

  public async renderHTMLSharing(imageId: string): Promise<string> {
    try {
      const resultImageLink = await this.quizRepository.findResultImageByKey(imageId);

      if (!resultImageLink) {
        throw new NotFoundException(`Result image link not found for imageId: ${imageId}`);
      }

      const imageResultLink = this.s3Service.getImageUrl(imageId);
      const shareFacebookDto: ShareFacebookDto = { badgeImage: imageResultLink };

      const template = 'share-facebook.mustache';
      const htmlContent = await this.mustacheService.renderHTMLResult(template, shareFacebookDto);

      return htmlContent;
    } catch (error) {
      this.logger.error(`Failed to render HTML sharing for imageId: ${imageId}`, error);

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(
        `Internal server error while rendering HTML sharing for imageId: ${imageId}`,
      );
    }
  }
}
