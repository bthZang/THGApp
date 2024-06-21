import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBadRequestResponse, ApiNotFoundResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { AuthUser, PublicRoute, ResponseMessage } from '../../../decorators';
import { UserResponse } from '../../../modules/auth/domains/dtos/responses/user-response.dto';
import { FindQuestionsDto } from '../../../modules/quiz/domains/dtos/requests/find-questions.dto';
import { QuizResDto } from '../../../modules/quiz/domains/dtos/responses/quiz-response.dto';
import { SaveResultDto } from '../domains/dtos/requests/save-result.dto';
import { SubmitRequestDto } from '../domains/dtos/requests/submit-quiz-client-data.dto';
import { ResultResponseDto } from '../domains/dtos/responses/result-data-response.dto';
import { QuizDto } from '../domains/dtos/responses/user-quiz-result.dto';
import { IQuizService } from '../services/quiz.service';

@Controller('/v1/quizzes')
@ApiTags('Quiz')
export class QuizController {
  constructor(
    @Inject('IQuizService')
    private readonly quizService: IQuizService,
  ) {}

  @PublicRoute(true)
  @Post('images')
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(@UploadedFile() file: Express.Multer.File): Promise<{ imageId: string }> {
    const imageId = await this.quizService.uploadImage(file);

    return { imageId };
  }

  @PublicRoute(true)
  @Get('images/:id')
  viewImage(@Param('id') imageId: string) {
    const imageUrl = this.quizService.viewImage(imageId);

    return { imageUrl };
  }

  @PublicRoute(true)
  @Get('questions')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Get quiz questions success!')
  @ApiOperation({ summary: 'Get quiz questions' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful operation',
    type: QuizResDto,
  })
  @ApiNotFoundResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The requested data was not found!',
  })
  async getQuiz(@Query() findQuestionDto: FindQuestionsDto): Promise<QuizResDto> {
    return this.quizService.getQuiz(findQuestionDto);
  }

  @PublicRoute(true)
  @Post('/submit')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Submit quiz questions and answer' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Successful operation',
  })
  @ApiBadRequestResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Missing data',
  })
  submitQuiz(@Body() data: SubmitRequestDto[]): Promise<ResultResponseDto> {
    return this.quizService.submitQuiz(data);
  }

  @Post('/save')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Save quiz result' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Successful operation',
  })
  @ApiBadRequestResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Missing data',
  })
  async saveResult(@Body() saveResult: SaveResultDto, @AuthUser() user: UserResponse): Promise<QuizDto> {
    return this.quizService.saveQuizResultData({ ...saveResult, userId: user.id });
  }

  @PublicRoute(true)
  @Get('/results/render/:id')
  async viewQuizResult(@Param('id') id: string, @Res() res: Response) {
    const renderedHtml = await this.quizService.renderHTMLResult(id);

    res.setHeader('Content-Type', 'text/html');
    res.send(renderedHtml);
  }

  @PublicRoute(true)
  @Get('images/share/:imageId')
  async viewHTMLFacebook(@Param('imageId') imageId: string, @Res() res: Response) {
    const renderedHtml = await this.quizService.renderHTMLSharing(imageId);

    res.setHeader('Content-Type', 'text/html');
    res.send(renderedHtml);
  }
}
