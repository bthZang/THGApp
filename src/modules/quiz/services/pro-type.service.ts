import { Inject, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';

import { ProTypeEntity } from '../../../modules/quiz/domains/entities/pro-type.entity';
import { ProTypeDto } from '../domains/dtos/responses/pro-type.dto';
import { IProTypeRepository } from '../repositories/pro-type.repository';

export interface IProTypeService {
  findByName(name: string): Promise<ProTypeDto | null>;
  findProTypeByName(name: string): Promise<ProTypeEntity>;
}

@Injectable()
export class ProTypeService implements IProTypeService {
  public logger: Logger;

  constructor(
    @Inject('IProTypeRepository')
    public readonly proTypeRepository: IProTypeRepository,
  ) {
    this.logger = new Logger(ProTypeService.name);
  }

  public async findByName(name: string): Promise<ProTypeDto | null> {
    try {
      const proType = await this.proTypeRepository.findByName(name);

      if (!proType) {
        throw new NotFoundException(`Pro Type not found with name: ${name} `);
      }

      return new ProTypeDto(proType);
    } catch (rawError) {
      const error = rawError instanceof NotFoundException ? rawError : new InternalServerErrorException(rawError);

      throw error;
    }
  }

  public async findProTypeByName(name: string): Promise<ProTypeEntity> {
    try {
      const proType = await this.proTypeRepository.findByName(name);

      if (!proType) {
        throw new NotFoundException(`Data not found for id: ${name}`);
      }

      return proType;
    } catch (rawError) {
      this.logger.error(`Failed to render HTML result for id: ${name}`, rawError);

      const error = rawError instanceof NotFoundException ? rawError : new InternalServerErrorException(rawError);

      throw error;
    }
  }
}
