import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUserDto } from '../domains/dtos/requests/create-user.dto';
import { UserDto } from '../domains/dtos/user.dto';
import { UserEntity } from '../domains/entities/user.entity';

export interface IUserRepository {
  findById(id: string): Promise<UserEntity | null>;
  createUser(user: CreateUserDto): Promise<UserDto>;
  findByEmail(email: string): Promise<UserDto | null>;
}

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  public async findById(id: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({
      where: {
        id,
      },
    });
  }

  public async findByEmail(email: string): Promise<UserDto | null> {
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      return null;
    }

    return new UserDto(user);
  }

  public async createUser(createUserDto: CreateUserDto): Promise<UserDto> {
    const userEntity = {
      fullName: createUserDto.fullName,
      email: createUserDto.email,
      avatar: createUserDto.avatar,
    };
    this.userRepository.create(userEntity);
    const createdEntity = await this.userRepository.save(userEntity);
    const userDto = new UserDto(createdEntity);

    return userDto;
  }
}
