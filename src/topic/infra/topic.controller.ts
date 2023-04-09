import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { TopicService } from './topic.service';
import { AskQuestionDto } from './dto/ask-question.dto';

@Controller('/topics')
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
  @Post('/completions')
  async answerQuestion(@Body() dto: AskQuestionDto): Promise<string> {
    try {
      this.topicService.makeCompletion(dto);
    } catch {
      console.log('error');
    }
    return null;
  }
}
