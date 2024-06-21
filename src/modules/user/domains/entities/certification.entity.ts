import { Column, Entity, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../../../../common/abstract.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'certifications' })
export class CertificationEntity extends AbstractEntity {
  @Column({ type: 'varchar' })
  name!: string;

  @Column({ type: 'varchar' })
  organization!: string;

  @Column({ type: 'varchar' })
  completionDate!: string;

  @ManyToOne(() => UserEntity, (user) => user.certifications)
  user!: UserEntity;
}
