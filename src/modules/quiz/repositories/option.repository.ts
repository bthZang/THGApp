import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { OptionEntity } from '../domains/entities/option.entity';

export interface IOptionRepository {
  findById(id: string): Promise<OptionEntity | null>;
}

@Injectable()
export class OptionRepository implements IOptionRepository {
  constructor(
    @InjectRepository(OptionEntity)
    private optionRepository: Repository<OptionEntity>,
  ) {}

  async findById(id: string): Promise<OptionEntity | null> {
    return this.optionRepository.findOne({
      where: {
        id,
      },
      relations: {
        question: false,
      },
    });
  }
}
