import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ProStrengthEntity } from '../domains/entities/pro-strength.entity';

export interface IProStrengthRepository {
  findByName(name: string): Promise<ProStrengthEntity | null>;
}

@Injectable()
export class ProStrengthRepository implements IProStrengthRepository {
  constructor(
    @InjectRepository(ProStrengthEntity)
    private proStrengthRepository: Repository<ProStrengthEntity>,
  ) {}

  public async findByName(name: string): Promise<ProStrengthEntity | null> {
    return this.proStrengthRepository.findOne({
      where: {
        name,
      },
    });
  }
}
