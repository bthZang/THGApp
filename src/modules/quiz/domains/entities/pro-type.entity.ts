import { Column, Entity, OneToMany } from 'typeorm';

import { AbstractEntity } from '../../../../common/abstract.entity';
import { QuizEntity } from './quiz.entity';

export interface IProFigure {
  name: string;
  title: string;
}

export interface IProContent {
  name: string;
  author: string;
  img: string;
}

export interface IValue {
  value1: string;
  value2: string;
}
@Entity({ name: 'pro_types' })
export class ProTypeEntity extends AbstractEntity {
  @Column({ nullable: false, type: 'varchar' })
  name!: string;

  @Column({ nullable: false, type: 'jsonb' })
  values!: IValue;

  @Column({ nullable: false, type: 'varchar' })
  description!: string;

  @Column({ nullable: false, type: 'varchar' })
  imgType!: string;

  @Column({ nullable: false, type: 'varchar' })
  improvement!: string;

  @Column({ nullable: false, type: 'varchar' })
  imgStrength!: string;

  @Column({ nullable: false, type: 'jsonb' })
  figure!: IProFigure[];

  @Column({ nullable: false, type: 'json' })
  content!: IProContent[];

  @OneToMany(() => QuizEntity, (quiz) => quiz.proType)
  quizzes!: QuizEntity[];
}
