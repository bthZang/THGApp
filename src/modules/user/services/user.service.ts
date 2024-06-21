import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';

import { CreateUserDto } from '../domains/dtos/requests/create-user.dto';
import { UserDto } from '../domains/dtos/user.dto';
import { IUserRepository } from '../repositories/user.repository';

export interface IUserService {
  findById(id: string): Promise<UserDto>;
  createUser(userDto: CreateUserDto): Promise<UserDto>;
  getUserAccount(email: string): Promise<UserDto | null>;
}

@Injectable()
export class UserService implements IUserService {
  public logger: Logger;

  constructor(
    @Inject('IUserRepository')
    public readonly userRepository: IUserRepository,
  ) {
    this.logger = new Logger(UserService.name);
  }

  public async findById(id: string): Promise<UserDto> {
    try {
      const user = await this.userRepository.findById(id);

      if (!user) {
        throw new NotFoundException(`Cannot found user with id: ${id}`);
      }

      return new UserDto(user);
    } catch (error) {
      this.logger.error(error);

      throw error;
    }
  }

  public async createUser(createUserDto: CreateUserDto): Promise<UserDto> {
    try {
      const newUser = await this.userRepository.createUser(createUserDto);

      return newUser;
    } catch (error) {
      this.logger.error(error);

      throw error;
    }
  }

  public async getUserAccount(email: string): Promise<UserDto | null> {
    try {
      const userDto = await this.userRepository.findByEmail(email);

      return userDto;
    } catch (error) {
      this.logger.error(error);

      throw error;
    }
  }
}
