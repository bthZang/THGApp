import { Column, Entity, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../../../../common/abstract.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'interests' })
export class InterestEntity extends AbstractEntity {
  @Column({ type: 'varchar' })
  name!: string;

  @Column({ type: 'varchar' })
  description!: string;

  @ManyToOne(() => UserEntity, (user) => user.interests)
  user!: UserEntity;
}
