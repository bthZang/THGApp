import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { AbstractEntity } from '../../../../common/abstract.entity';
import { UserEntity } from '../../../user/domains/entities/user.entity';
import { ProTypeEntity } from './pro-type.entity';
import { QuizResultStrengthEntity } from './quiz-result-strength.entity';

@Entity({ name: 'quizzes' })
export class QuizEntity extends AbstractEntity {
  @ManyToOne(() => UserEntity, (user) => user.quizzes)
  user!: UserEntity;

  @ManyToOne(() => ProTypeEntity, (proType) => proType.quizzes)
  proType!: ProTypeEntity;

  @Column({ nullable: false, type: 'varchar' })
  imgKey!: string;

  @OneToMany(() => QuizResultStrengthEntity, (quizResultStrength) => quizResultStrength.quiz)
  quizResultStrengths!: QuizResultStrengthEntity[];
}
