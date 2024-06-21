import { Column, Entity, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../../../../common/abstract.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'activities' })
export class ActivityEntity extends AbstractEntity {
  @Column({ type: 'varchar' })
  name!: string;

  @Column({ type: 'varchar' })
  role!: string;

  @Column({ type: 'varchar' })
  timePeriod!: string;

  @Column({ type: 'varchar' })
  description!: string;

  @ManyToOne(() => UserEntity, (user) => user.activities)
  user!: UserEntity;
}
