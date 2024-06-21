import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { IRuleData, RuleEntity } from '../domains/entities/rule.entity';

export interface IRuleRepository {
  findById(id: string): Promise<RuleEntity | null>;
  findByName(ruleName: string): Promise<RuleEntity | null>;
  create(ruleName: string, rules: IRuleData[]): Promise<RuleEntity>;
}

@Injectable()
export class RuleRepository implements IRuleRepository {
  constructor(
    @InjectRepository(RuleEntity)
    private ruleRepository: Repository<RuleEntity>,
  ) {}

  public async findById(id: string): Promise<RuleEntity | null> {
    return this.ruleRepository.findOne({
      where: {
        id,
      },
    });
  }

  public async findByName(ruleName: string): Promise<RuleEntity | null> {
    return this.ruleRepository.findOne({
      where: {
        ruleName,
      },
    });
  }

  public async create(ruleName: string, rules: IRuleData[]): Promise<RuleEntity> {
    const ruleEntity = new RuleEntity();
    ruleEntity.ruleName = ruleName;
    ruleEntity.ruleData = rules;
    const result = await this.ruleRepository.save(ruleEntity);

    return result;
  }
}
