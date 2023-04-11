import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { TopicService } from './topic.service';
import { AskQuestionDto } from './dto/ask-question.dto';
import { GetUserIdFromAccessToken } from '../../common/decorator/get-userid-from-accesstoken.decorator';

@Controller()
export class TopicController {
  constructor(private readonly topicService: TopicService) {}

  @Get()
  getHello(): string {
    console.log('hi');
    return this.topicService.getHello();
  }

  @Get('/test')
  async getHello2(
    @Query('chat') chat: string,
    @Res() res: Response,
  ): Promise<string> {
    console.log(chat);
    return null;
  }
  @Post('/topics/completion')
  async askQuestion(
    @Body() dto: AskQuestionDto,
    @GetUserIdFromAccessToken() userId: string,
  ): Promise<string> {
    try {
      await this.topicService.makeCompletion(dto, userId);
    } catch (err) {
      console.log(err);
    }
    return null;
  }
}
