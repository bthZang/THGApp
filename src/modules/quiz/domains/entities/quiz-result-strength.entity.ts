import { Entity, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../../../../common/abstract.entity';
import { ProStrengthEntity } from './pro-strength.entity';
import { QuizEntity } from './quiz.entity';

@Entity({ name: 'quiz_result_strengths' })
export class QuizResultStrengthEntity extends AbstractEntity {
  @ManyToOne(() => QuizEntity, (quiz) => quiz.quizResultStrengths)
  quiz!: QuizEntity;

  @ManyToOne(() => ProStrengthEntity, (proStrength) => proStrength.quizResultStrengths)
  proStrength!: ProStrengthEntity;
}
