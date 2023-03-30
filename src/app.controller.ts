import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { makeCompletion } from './ai-models/gpt-model';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    console.log('hi');
    return this.appService.getHello();
  }

  @Get('/test')
  async getHello2(
    @Query('chat') chat: string,
    @Res() res: Response,
  ): Promise<string> {
    console.log(chat);
    makeCompletion(chat, res);
    // console.log('hi');

    return 'hi';
    // return this.appService.getHello();
  }
  @Post('/test')
  async getHello3(@Body() body: any, @Res() res: Response): Promise<string> {
    console.log(body.chat);
    // console.log(chat);
    makeCompletion(body.chat, res);
    // console.log('hi');

    return 'hi';
    // return this.appService.getHello();
  }
}
