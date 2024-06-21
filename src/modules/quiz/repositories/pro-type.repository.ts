import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ProTypeEntity } from '../domains/entities/pro-type.entity';

export interface IProTypeRepository {
  findByName(name: string): Promise<ProTypeEntity | null>;
}

@Injectable()
export class ProTypeRepository implements IProTypeRepository {
  constructor(
    @InjectRepository(ProTypeEntity)
    private proTypeRepository: Repository<ProTypeEntity>,
  ) {}

  public async findByName(name: string): Promise<ProTypeEntity | null> {
    return this.proTypeRepository.findOne({
      where: {
        name,
      },
    });
  }
}
