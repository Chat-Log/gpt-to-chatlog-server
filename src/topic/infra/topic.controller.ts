import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { TopicService } from './topic.service';
import { AskQuestionDto } from './dto/ask-question.dto';
import { GetUserIdFromAccessToken } from '../../common/decorator/get-userid-from-accesstoken.decorator';
import { ChangeTopicTitleDto } from './dto/change-topic-title.dto';
import { SearchCompletionsDto } from './dto/search-completions.dto';
import { SearchCompletionsWithTopicOptions } from '../../common/interface/interface';
import { TopicCommonResponseDto } from './dto/topic.common-response.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserGuard } from '../../common/guard/user.guard';
import { RetrieveDailyCompletionCountsDto } from './dto/retrieve-daily-completion-counts.dto';
import { Response } from 'express';

@Controller()
@ApiTags('Topic')
@ApiBearerAuth()
export class TopicController {
  constructor(private readonly topicService: TopicService) {}

  @Post('topics/completion')
  async askQuestion(
    @Body() dto: AskQuestionDto,
    @GetUserIdFromAccessToken() userId: string,
    @Res() res: Response,
  ): Promise<void> {
    const answerStream = await this.topicService.askQuestion(dto, userId);
    answerStream
      .on('data', (data) => {
        console.log(data);
        const decodedData = data.toString('utf-8');
        res.write(decodedData);
      })
      .on('end', () => {
        res.end();
      })
      .on('error', (err) => {
        console.error('Stream error:', err);
        res.status(500).send(err.message);
      });
  }

  @UseGuards(UserGuard)
  @Patch('/topics/:topicId/title')
  @ApiOperation({ summary: 'Change topic title' })
  async changeTopicTitle(
    @Body() dto: ChangeTopicTitleDto,
    @Param('topicId') topicId: string,
  ) {
    const { title } = dto;
    const topic = await this.topicService.changeTopicTitle(topicId, title);
    const { id, title: newTitle } = topic.getPropsCopy();
    return new TopicCommonResponseDto().toResponse({ id, title: newTitle });
  }

  @UseGuards(UserGuard)
  @Get('/topics/completions')
  @ApiOperation({ summary: 'Search completions' })
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

  @ApiOperation({ summary: 'Retrieve all tags' })
  @UseGuards(UserGuard)
  @Get('/topics/tags')
  async retrieveAllTags(@GetUserIdFromAccessToken() userId: string) {
    const tagNames = await this.topicService.retrieveAllTags(userId);
    return new TopicCommonResponseDto().toResponse(tagNames);
  }

  @Get('/completions/counts/:year')
  @UseGuards(UserGuard)
  @ApiOperation({ summary: 'Retrieve daily completion counts' })
  async retrieveDailyCompletionCounts(
    @Param() dto: RetrieveDailyCompletionCountsDto,
    @GetUserIdFromAccessToken() userId: string,
  ) {
    let { year } = dto;
    if (!dto.year) year = new Date().getFullYear().toString();
    const completionCounts =
      await this.topicService.retrieveDailyCompletionCounts(userId, year);
    return new TopicCommonResponseDto().toResponse(completionCounts);
  }
}
