import { Column, Entity, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../../../../common/abstract.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'languages' })
export class LanguageEntity extends AbstractEntity {
  @Column({ type: 'varchar' })
  name!: string;

  @Column({ type: 'varchar' })
  proficiencyLevel!: string;

  @ManyToOne(() => UserEntity, (user) => user.languages)
  user!: UserEntity;
}
