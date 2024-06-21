import { Column, Entity, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../../../../common/abstract.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'achievements' })
export class AchievementEntity extends AbstractEntity {
  @Column({ type: 'varchar' })
  name!: string;

  @Column({ type: 'varchar' })
  organization!: string;

  @Column({ type: 'date' })
  awardDate!: Date;

  @ManyToOne(() => UserEntity, (user) => user.achievements)
  user!: UserEntity;
}
