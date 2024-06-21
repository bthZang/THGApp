import { Controller, Get, HttpCode, HttpStatus, Inject, Param } from '@nestjs/common';
import { ApiNotFoundResponse, ApiResponse, ApiTags } from '@nestjs/swagger';

import { UUIDParam } from '../../../decorators';
import { RuleDto } from '../domains/dtos/responses/rule.dto';
import { IRuleService } from '../services/rule.service';

@Controller('/v1/rules')
@ApiTags('Rule')
export class RuleController {
  constructor(
    @Inject('IRuleService')
    private readonly ruleService: IRuleService,
  ) {}

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get Rule',
    type: RuleDto,
  })
  @ApiNotFoundResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Rule not found.',
  })
  async getRule(@UUIDParam('id') ruleId: Uuid): Promise<RuleDto> {
    return this.ruleService.findById(ruleId);
  }

  @Get('name/:ruleName')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get Rule',
    type: RuleDto,
  })
  @ApiNotFoundResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Rule not found.',
  })
  async getRuleByName(@Param('ruleName') ruleName: string): Promise<RuleDto> {
    return this.ruleService.findByName(ruleName);
  }
}
