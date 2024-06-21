import { Column, Entity } from 'typeorm';

import { AbstractEntity } from '../../../../common/abstract.entity';
import { UseDto } from '../../../../decorators';
import { RuleDto } from '../dtos/responses/rule.dto';

export interface ICondition {
  fact: string;
  operator: string;
  value: string;
  path: string;
}

export interface IEvent {
  type: string;
  params: IParams;
}

export interface IParams {
  type: string;
  strengths: string[];
}

export interface IConditions {
  all: ICondition[];
}

export interface IRuleData {
  conditions: IConditions;
  event: IEvent;
}

@Entity({ name: 'rules' })
@UseDto(RuleDto)
export class RuleEntity extends AbstractEntity<RuleDto> {
  @Column({ nullable: false, type: 'varchar' })
  ruleName!: string;

  @Column('jsonb', { nullable: true })
  ruleData!: IRuleData[];
}
