import { Column, Entity, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../../../../common/abstract.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'experiences' })
export class ExperienceEntity extends AbstractEntity {
  @Column({ type: 'varchar' })
  company!: string;

  @Column({ type: 'varchar' })
  position!: string;

  @Column({ type: 'varchar' })
  timePeriod!: string;

  @Column({ type: 'varchar' })
  description!: string;

  @ManyToOne(() => UserEntity, (user) => user.experiences)
  user!: UserEntity;
}
