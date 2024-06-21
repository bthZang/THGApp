import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MustacheService } from '../../shared/services/mustache.service';
import { RuleEngineService } from '../../shared/services/rule-engine.service';
import { SharedModule } from '../../shared/shared.module';
// Controllers
import { QuizController } from './controllers/quiz.controller';
import { RuleController } from './controllers/rule.controller';
import { OptionEntity } from './domains/entities/option.entity';
import { ProStrengthEntity } from './domains/entities/pro-strength.entity';
import { ProTypeEntity } from './domains/entities/pro-type.entity';
import { QuestionEntity } from './domains/entities/question.entity';
import { QuizEntity } from './domains/entities/quiz.entity';
import { QuizResultStrengthEntity } from './domains/entities/quiz-result-strength.entity';
import { ResultImageEntity } from './domains/entities/result-image.entity';
import { RuleEntity } from './domains/entities/rule.entity';
import { OptionRepository } from './repositories/option.repository';
import { ProStrengthRepository } from './repositories/pro-strength.repository';
import { ProTypeRepository } from './repositories/pro-type.repository';
import { QuestionRepository } from './repositories/question.repository';
import { QuizRepository } from './repositories/quiz.repository';
import { RuleRepository } from './repositories/rule.repository';
import { ProStrengthService } from './services/pro-strength.service';
import { ProTypeService } from './services/pro-type.service';
import { QuestionService } from './services/question.service';
import { QuizService } from './services/quiz.service';
import { RuleService } from './services/rule.service';
// Services
// Repositories
// Entities

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RuleEntity,
      QuizEntity,
      QuestionEntity,
      OptionEntity,
      QuizEntity,
      QuizResultStrengthEntity,
      ProStrengthEntity,
      ProTypeEntity,
      ResultImageEntity,
    ]),
    SharedModule,
  ],
  controllers: [RuleController, QuizController],
  exports: ['IRuleService', 'IRuleRepository', 'IQuizRepository', 'IQuizService'],
  providers: [
    {
      provide: 'IQuizService',
      useClass: QuizService,
    },
    {
      provide: 'IRuleRepository',
      useClass: RuleRepository,
    },
    {
      provide: 'IRuleService',
      useClass: RuleService,
    },
    {
      provide: 'IRuleEngineService',
      useClass: RuleEngineService,
    },
    {
      provide: 'IProTypeService',
      useClass: ProTypeService,
    },
    {
      provide: 'IProTypeRepository',
      useClass: ProTypeRepository,
    },
    {
      provide: 'IMustacheService',
      useClass: MustacheService,
    },
    {
      provide: 'IProStrengthRepository',
      useClass: ProStrengthRepository,
    },
    {
      provide: 'IQuestionRepository',
      useClass: QuestionRepository,
    },
    {
      provide: 'IOptionRepository',
      useClass: OptionRepository,
    },
    {
      provide: 'IQuizRepository',
      useClass: QuizRepository,
    },
    {
      provide: 'IQuestionService',
      useClass: QuestionService,
    },
    {
      provide: 'IProStrengthService',
      useClass: ProStrengthService,
    },
  ],
})
export class QuizModule {}
