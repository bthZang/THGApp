import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject
} from '@nestjs/common';
import { ApiNotFoundResponse, ApiResponse, ApiTags } from '@nestjs/swagger';

import { UUIDParam } from '../../../decorators';
import { UserDto } from '../domains/dtos/user.dto';
import { IUserService } from '../services/user.service';

@Controller('/v1/users')
@ApiTags('User')
export class UserController {
  constructor(
    @Inject('IUserService')
    private readonly userService: IUserService,
  ) { }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get user',
    type: UserDto,
  })
  @ApiNotFoundResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found.',
  })
  async getUser(@UUIDParam('id') userId: Uuid): Promise<UserDto> {
    return this.userService.findById(userId);
  }
}
