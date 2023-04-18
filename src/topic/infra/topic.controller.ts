import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { TopicService } from './topic.service';
import { AskQuestionDto } from './dto/ask-question.dto';
import { GetUserIdFromAccessToken } from '../../common/decorator/get-userid-from-accesstoken.decorator';
import { ChangeTopicTitleDto } from './dto/change-topic-title.dto';
import { SearchCompletionsDto } from './dto/search-completions.dto';
import { SearchCompletionsWithTopicOptions } from '../../common/interface/interface';
import { TopicCommonResponseDto } from './dto/topic.common-response.dto';

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
    await this.topicService.askQuestion(dto, userId);
    return null;
  }

  @Patch('/topics/:topicId/name')
  async changeTopicTitle(
    @Body() dto: ChangeTopicTitleDto,
    @Param('topicId') topicId: string,
  ) {
    const { title } = dto;
    return await this.topicService.changeTopicTitle(topicId, title);
  }

  @Get('/topics/completions')
  async searchCompletions(@Query() dto: SearchCompletionsDto) {
    const {
      tagnames: tagNames,
      onlylastcompletions: onlyLastCompletions,
      modelnames: modelNames,
      date,
      searchtype: searchType,
      pagesize: pageSize = 10,
      pageindex: pageIndex = 1,
      query,
    } = dto;
    const options: SearchCompletionsWithTopicOptions = {
      tagNames,
      onlyLastCompletions,
      modelNames,
      date,
      searchType,
      pageSize: +pageSize,
      pageIndex: +pageIndex,
      query,
    };
    const [completions, pageTotalCount] =
      await this.topicService.searchCompletionsWithTopic(options);
    return new TopicCommonResponseDto().toResponse(completions, {
      pageTotalCount,
    });
  }

  @Get('/topics/tags')
  async retrieveAllTags(@GetUserIdFromAccessToken() userId: string) {
    const tagNames = await this.topicService.retrieveAllTags(userId);
    return new TopicCommonResponseDto().toResponse(tagNames);
  }

  @Get('/completions/counts/:year')
  async retrieveDailyCompletionCounts(
    @Param('year') year: string,
    @GetUserIdFromAccessToken() userId: string,
  ) {
    if (!year) year = new Date().getFullYear().toString();
    const completionCounts =
      await this.topicService.retrieveDailyCompletionCounts(userId, year);
    return new TopicCommonResponseDto().toResponse(completionCounts);
  }
}
