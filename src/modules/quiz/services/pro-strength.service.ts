import { Inject, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';

import { ProStrengthEntity } from '../domains/entities/pro-strength.entity';
import { IProStrengthRepository } from '../repositories/pro-strength.repository';

export interface IProStrengthService {
  findByName(name: string): Promise<ProStrengthEntity>;
}

@Injectable()
export class ProStrengthService implements IProStrengthService {
  public logger: Logger;

  constructor(
    @Inject('IProStrengthRepository')
    public readonly proStrengthRepository: IProStrengthRepository,
  ) {
    this.logger = new Logger(ProStrengthService.name);
  }

  public async findByName(name: string): Promise<ProStrengthEntity> {
    try {
      const strengthEntity = await this.proStrengthRepository.findByName(name);

      if (!strengthEntity) {
        throw new NotFoundException(`Pro Strength with name ${name} not found`);
      }

      return strengthEntity;
    } catch (rawError) {
      this.logger.error(`Pro Strength with name ${name} not found`, rawError);

      const error = rawError instanceof NotFoundException ? rawError : new InternalServerErrorException(rawError);

      throw error;
    }
  }
}
