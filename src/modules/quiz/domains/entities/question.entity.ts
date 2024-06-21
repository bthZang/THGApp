import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';

import { AbstractEntity } from '../../../../common/abstract.entity';
import { QuizType } from '../../../../constants';
import { OptionEntity } from './option.entity';
import { ProStrengthEntity } from './pro-strength.entity';

@Entity({ name: 'questions' })
export class QuestionEntity extends AbstractEntity {
  @Column({ nullable: false, type: 'varchar' })
  question!: string;

  @Column({ nullable: false, type: 'enum', enum: QuizType, default: QuizType.PERSONALITY })
  quizType!: QuizType;

  @Column({ nullable: false, type: 'varchar' })
  img!: string;

  @OneToMany(() => OptionEntity, (option) => option.question, {
    cascade: true,
  })
  options!: OptionEntity[];

  @OneToOne(() => ProStrengthEntity, (proStrength) => proStrength.question, {
    nullable: true,
    cascade: true,
  })
  @JoinColumn()
  proStrength!: ProStrengthEntity;
}
