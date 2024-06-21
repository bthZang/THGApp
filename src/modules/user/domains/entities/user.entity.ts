import { Column, Entity, OneToMany } from 'typeorm';

import { AbstractEntity } from '../../../../common/abstract.entity';
import { RoleType } from '../../../../constants';
import { UseDto } from '../../../../decorators';
import { QuizEntity } from '../../../../modules/quiz/domains/entities/quiz.entity';
import { UserDto, UserDtoOptions } from '../dtos/user.dto';
import { AchievementEntity } from './achievement.entity';
import { ActivityEntity } from './activity.entity';
import { CertificationEntity } from './certification.entity';
import { ExperienceEntity } from './experience.entity';
import { InterestEntity } from './interest.entity';
import { LanguageEntity } from './language.entity';

@Entity({ name: 'users' })
@UseDto(UserDto)
export class UserEntity extends AbstractEntity<UserDto, UserDtoOptions> {
  @Column({ nullable: true, type: 'varchar' })
  fullName!: string | null;

  @Column({ type: 'enum', enum: RoleType, default: RoleType.USER })
  role!: RoleType;

  @Column({ unique: true, nullable: true, type: 'varchar' })
  email!: string | null;

  @Column({ nullable: true, type: 'varchar' })
  phone!: string | null;

  @Column({ nullable: true, type: 'varchar' })
  password!: string | null;

  @Column({ nullable: true, type: 'varchar' })
  avatar!: string | null;

  @Column({ nullable: true, type: 'varchar' })
  coverPicture!: string | null;

  @Column({ nullable: true, type: 'date' })
  dateOfBirth!: Date | null;

  @Column({ nullable: true, type: 'varchar' })
  gender!: string | null;

  @Column({ nullable: true, type: 'varchar' })
  location!: string | null;

  @Column({ nullable: true, type: 'varchar' })
  school!: string | null;

  @Column({ nullable: true, type: 'varchar' })
  major!: string | null;

  @Column({ nullable: true, type: 'varchar' })
  socialLink!: string | null;

  @Column({ nullable: true, type: 'float' })
  gpa!: number | null;

  @OneToMany(() => QuizEntity, (quiz) => quiz.user)
  quizzes!: QuizEntity[];

  @OneToMany(() => ExperienceEntity, (experience) => experience.user)
  experiences!: ExperienceEntity[];

  @OneToMany(() => CertificationEntity, (certification) => certification.user)
  certifications!: CertificationEntity[];

  @OneToMany(() => LanguageEntity, (language) => language.user)
  languages!: LanguageEntity[];

  @OneToMany(() => InterestEntity, (interest) => interest.user)
  interests!: InterestEntity[];

  @OneToMany(() => AchievementEntity, (achievement) => achievement.user)
  achievements!: AchievementEntity[];

  @OneToMany(() => ActivityEntity, (activity) => activity.user)
  activities!: ActivityEntity[];
}
