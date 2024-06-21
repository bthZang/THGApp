import { Column, Entity } from 'typeorm';

import { AbstractEntity } from '../../../../common/abstract.entity';

@Entity({ name: 'result_images' })
export class ResultImageEntity extends AbstractEntity {
  @Column()
  imgKey!: string;
}
