import { IsObject } from 'class-validator';

import { AbstractDto } from '../../../../../common/dto/abstract.dto';
import { StringFieldOptional } from '../../../../../decorators';
import { IRuleData, RuleEntity } from '../../entities/rule.entity';

export class RuleDto extends AbstractDto {
  @StringFieldOptional({ nullable: false })
  ruleName: string;

  @IsObject()
  ruleData: IRuleData[];

  constructor(rule: RuleEntity) {
    super(rule);
    this.ruleName = rule.ruleName;
    this.ruleData = rule.ruleData;
  }
}
