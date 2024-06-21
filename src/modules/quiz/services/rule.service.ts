import { randomBytes } from 'node:crypto';

import {
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Event, Fact, RuleProperties } from 'json-rules-engine';

import { IsCorrected } from '../../../constants/is-corrected';
import { AwsS3Service } from '../../../shared/services/aws-s3.service';
import { RuleEngineService } from '../../../shared/services/rule-engine.service';
import { SubmitQuizDto } from '../domains/dtos/requests/submit-quiz-rule-engine-input.dto';
import { ResultDataDto } from '../domains/dtos/responses/result-data.dto';
import { RuleDto } from '../domains/dtos/responses/rule.dto';
import { IEvent, IRuleData } from '../domains/entities/rule.entity';
import { IRuleRepository } from '../repositories/rule.repository';
import { IProTypeService } from './pro-type.service';

export interface IRuleService {
  findById(id: string): Promise<RuleDto>;
  findByName(ruleName: string): Promise<RuleDto>;
  createRule(ruleName: string, rules: IRuleData[]): Promise<RuleDto>;

  handleRuleEngineOutput(submit: SubmitQuizDto[]): Promise<ResultDataDto | null>;
}

function getRandomStrengths(array: string[], size: number, exclude: string[]): string[] {
  const filteredArray = array.filter((item) => !exclude.includes(item));

  // Shuffle using crypto for better randomness
  const shuffledArray = filteredArray
    .map((value) => ({ value, sort: randomBytes(1)[0] }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);

  return shuffledArray.slice(0, size);
}

function secureShuffle(array: IEvent[]): IEvent[] {
  const shuffledArray = array
    .map((value) => ({ value, sort: randomBytes(1)[0] }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);

  return shuffledArray;
}

const allStrengths = [
  'PROJECT MANAGEMENT',
  'PROFESSIONALISM',
  'LEADERSHIP',
  'COMMUNICATION',
  'TEAMWORK',
  'EMOTION MANAGEMENT',
  'SELF MANAGEMENT',
  'CRITICAL THINKING',
];

@Injectable()
export class RuleService implements IRuleService {
  public logger: Logger;

  constructor(
    @Inject('IRuleRepository')
    public readonly ruleRepository: IRuleRepository,

    @Inject('IRuleEngineService')
    public readonly ruleEngine: RuleEngineService,

    @Inject('IProTypeService')
    public readonly proTypeService: IProTypeService,

    @Inject('IAwsS3Service')
    public readonly awsS3Service: AwsS3Service,
  ) {
    this.logger = new Logger(RuleService.name);
  }

  public async findById(id: string): Promise<RuleDto> {
    try {
      const rule = await this.ruleRepository.findById(id);

      if (!rule) {
        throw new NotFoundException(`Cannot found Rule with id: ${id}`);
      }

      return new RuleDto(rule);
    } catch (rawError) {
      const error = rawError instanceof NotFoundException ? rawError : new InternalServerErrorException(rawError);

      throw error;
    }
  }

  public async findByName(ruleName: string): Promise<RuleDto> {
    try {
      const rule = await this.ruleRepository.findByName(ruleName);

      if (!rule) {
        throw new NotFoundException(`Cannot found Rule with name: ${ruleName}`);
      }

      return new RuleDto(rule);
    } catch (error) {
      this.logger.error(error);

      throw error;
    }
  }

  public async createRule(ruleName: string, rules: IRuleData[]): Promise<RuleDto> {
    try {
      const result = await this.ruleRepository.create(ruleName, rules);

      return new RuleDto(result);
    } catch (rawError) {
      const error = rawError instanceof HttpException ? rawError : new InternalServerErrorException(rawError);

      throw error;
    }
  }

  public getFactFromSubmit(submit: SubmitQuizDto[]): Record<string, { isCorrected: string }> {
    try {
      const inputFact = {
        PROFESSIONALISM: { isCorrected: IsCorrected.FALSE },
        LEADERSHIP: { isCorrected: IsCorrected.FALSE },
        COMMUNICATION: { isCorrected: IsCorrected.FALSE },
        TEAMWORK: { isCorrected: IsCorrected.FALSE },
        EMOTIONMANAGEMENT: { isCorrected: IsCorrected.FALSE },
        SELFMANAGEMENT: { isCorrected: IsCorrected.FALSE },
        CRITICALTHINKING: { isCorrected: IsCorrected.FALSE },
      };

      for (const answer of submit) {
        const strength = answer.proStrengthName;
        inputFact[strength.replaceAll(/\s/g, '').toUpperCase()] = {
          isCorrected: answer.isCorrected ? IsCorrected.TRUE : IsCorrected.FALSE,
        };
      }

      return inputFact;
    } catch (rawError) {
      const error = rawError instanceof NotFoundException ? rawError : new InternalServerErrorException(rawError);

      throw error;
    }
  }

  public async getStrengthAndTypeByOptions(submit: SubmitQuizDto[]): Promise<Event[]> {
    try {
      const ruleName = submit[0].quizType;
      const rule = await this.ruleRepository.findByName(ruleName);

      if (!rule) {
        throw new NotFoundException(`Cannot found Rule with name: ${submit[0].quizType}`);
      }

      const fact = new Fact('answers', this.getFactFromSubmit(submit));
      const engine = new RuleEngineService();

      engine.importRules(rule.ruleData as RuleProperties[]);

      engine.addFact(fact);

      const result = await engine.run();

      return result.events;
    } catch (rawError) {
      const error = rawError instanceof NotFoundException ? rawError : new InternalServerErrorException(rawError);

      throw error;
    }
  }

  public async handleRuleEngineOutput(submit: SubmitQuizDto[]): Promise<ResultDataDto | null> {
    try {
      const events = (await this.getStrengthAndTypeByOptions(submit)) as IEvent[];

      if (events.length >= 2) {
        const shuffledEvents = secureShuffle(events);

        return this.getTypeDetails(shuffledEvents[0].params.type, shuffledEvents[0].params.strengths);
      } else if (events.length === 1) {
        const event = events[0];

        return this.getTypeDetails(event.params.type, event.params.strengths);
      }

      let trueStrengths = Object.entries(this.getFactFromSubmit(submit))
        .filter(([_, value]) => value.isCorrected === (IsCorrected.TRUE as string))
        .map(([key]) => key);

      if (trueStrengths.length === 0) {
        trueStrengths = getRandomStrengths(allStrengths, 1, []);
      } else if (trueStrengths.length >= 2) {
        trueStrengths = getRandomStrengths(trueStrengths, 2, []);
      }

      const result = await this.getTypeDetails('Professional Light Pub', trueStrengths);

      return result;
    } catch (rawError) {
      const error = rawError instanceof NotFoundException ? rawError : new InternalServerErrorException(rawError);

      throw error;
    }
  }

  public async getTypeDetails(proTypeName: string, proStrength: string[]): Promise<ResultDataDto | null> {
    try {
      const proType = await this.proTypeService.findByName(proTypeName);

      if (!proType) {
        return null;
      }

      const newMustacheInput: ResultDataDto = {
        type: {
          name: proType.name,
          description: proType.description,
          imgType: this.awsS3Service.getImageUrl(proType.imgType),
          imgStrength: this.awsS3Service.getImageUrl(proType.imgStrength),
          improvement: proType.improvement,
        },
        contents: proType.content.map((item) => ({
          ...item,
          img: this.awsS3Service.getImageUrl(item.img),
        })),
        figures: proType.figure,
        values: Object.values(proType.values).filter((value): value is string => typeof value === 'string'),
        strengths: proStrength,
      };

      return newMustacheInput;
    } catch (rawError) {
      const error = rawError instanceof NotFoundException ? rawError : new InternalServerErrorException(rawError);

      throw error;
    }
  }
}
