import { HttpModule } from '@nestjs/axios';
import { Global, Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { ApiConfigService } from './services/api-config.service';
import { AwsS3Service } from './services/aws-s3.service';
import { GeneratorService } from './services/generator.service';
import { MustacheService } from './services/mustache.service';
import { PuppeteerService } from './services/pupeeteer.service';
import { RuleEngineService } from './services/rule-engine.service';
import { TranslationService } from './services/translation.service';
import { ValidatorService } from './services/validator.service';

const providers: Provider[] = [
  GeneratorService,
  TranslationService,
  RuleEngineService,
  ApiConfigService,
  ValidatorService,
];

@Global()
@Module({
  imports: [CqrsModule, HttpModule],
  exports: [CqrsModule, 'IPuppeteerService', 'IMustacheService', 'IAwsS3Service', ...providers],
  providers: [
    ...providers,
    {
      provide: 'IPuppeteerService',
      useClass: PuppeteerService,
    },
    {
      provide: 'IMustacheService',
      useClass: MustacheService,
    },
    {
      provide: 'IAwsS3Service',
      useClass: AwsS3Service,
    },
  ],
})
export class SharedModule {}
