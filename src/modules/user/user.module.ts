import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RefreshTokenEntity } from '../../modules/auth/domains/entities/refresh-token.entity';
// Controllers
import { UserController } from './controllers/user.controller';
import { AchievementEntity } from './domains/entities/achievement.entity';
import { ActivityEntity } from './domains/entities/activity.entity';
import { CertificationEntity } from './domains/entities/certification.entity';
import { ExperienceEntity } from './domains/entities/experience.entity';
import { InterestEntity } from './domains/entities/interest.entity';
import { LanguageEntity } from './domains/entities/language.entity';
// Entities
import { UserEntity } from './domains/entities/user.entity';
// Repositories
import { UserRepository } from './repositories/user.repository';
// Services
import { UserService } from './services/user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      RefreshTokenEntity,
      AchievementEntity,
      ActivityEntity,
      CertificationEntity,
      ExperienceEntity,
      InterestEntity,
      LanguageEntity,
    ]),
  ],
  controllers: [UserController],
  exports: ['IUserService', 'IUserRepository'],
  providers: [
    {
      provide: 'IUserService',
      useClass: UserService,
    },
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
  ],
})
export class UserModule {}
