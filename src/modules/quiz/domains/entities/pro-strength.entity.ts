import { Column, Entity, OneToMany, OneToOne } from 'typeorm';

import { AbstractEntity } from '../../../../common/abstract.entity';
import { QuestionEntity } from './question.entity';
import { QuizResultStrengthEntity } from './quiz-result-strength.entity';

@Entity({ name: 'pro_strengths' })
export class ProStrengthEntity extends AbstractEntity {
  @Column({ nullable: false, type: 'varchar' })
  name!: string;

  @OneToOne(() => QuestionEntity, (question) => question.proStrength)
  question!: QuestionEntity;

  @OneToMany(() => QuizResultStrengthEntity, (quizResultStrength) => quizResultStrength.proStrength)
  quizResultStrengths!: QuizResultStrengthEntity[];
}
