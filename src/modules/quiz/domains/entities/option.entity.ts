import { Column, Entity, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../../../../common/abstract.entity';
import { QuestionEntity } from './question.entity';

@Entity({ name: 'options' })
export class OptionEntity extends AbstractEntity {
  @ManyToOne(() => QuestionEntity, { onUpdate: 'CASCADE' })
  question!: QuestionEntity;

  @Column({ nullable: false, type: 'varchar' })
  answer!: string;

  @Column({ nullable: false })
  isCorrect!: boolean;
}
