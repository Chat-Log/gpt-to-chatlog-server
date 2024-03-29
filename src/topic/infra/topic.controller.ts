import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { UserGuard } from '../../common/guard/user.guard';
import { RetrieveDailyCompletionCountsDto } from './dto/retrieve-daily-completion-counts.dto';
import { Request, Response } from 'express';
import { RetrieveRecentTopicsTitleDto } from './dto/retrieve-recent-topics-title.dto';
import { RetrieveUsedTokenCountDto } from './dto/retrieve-used-token-count.dto';
import { RetrieveExceptedFeeDto } from './dto/retrieve-excepted-fee.dto';
import { AddTopicTagDto } from './dto/add-topic-tag.dto';
import { DeleteTopicTagDto } from './dto/delete-topic-tag.dto';

@Controller()
@ApiTags('Topic')
@ApiBearerAuth()
export class TopicController {
  isPaused = false;
  constructor(private readonly topicService: TopicService) {}

  @Post('topics/completion')
  @ApiOperation({ summary: 'ask question to model' })
  async askQuestion(
    @Body() dto: AskQuestionDto,
    @GetUserIdFromAccessToken() userId: string,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<void> {
    const abortManager = {
      isAborted: false,
    };
    const { answerStream, topic } = await this.topicService.askQuestion(
      dto,
      userId,
      abortManager,
    );
    res.write(
      'topicId:' + topic.getPropsCopy().id.toString() + '\nendFlag' + '\n',
    );
    res.on('close', () => {
      abortManager.isAborted = true;
    });

    answerStream
      .on('data', (data) => {
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

  @Post('/topics/completion/pause')
  @ApiOperation({ summary: 'pause completion' })
  async pauseCompletion() {
    this.isPaused = true;
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
  async searchCompletions(
    @GetUserIdFromAccessToken() userId: string,
    @Query() dto: SearchCompletionsDto,
  ) {
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
    const [completions, totalCount] =
      await this.topicService.searchCompletionsWithTopic(userId, options);
    return new TopicCommonResponseDto().toResponse(completions, {
      totalCount,
    });
  }

  @UseGuards(UserGuard)
  @Patch('/topics/tags')
  @ApiOperation({ summary: 'add topic tags' })
  async addTopicTag(
    @GetUserIdFromAccessToken() userId: string,
    @Body() dto: AddTopicTagDto,
  ) {
    const { topicId, tagName } = dto;

    await this.topicService.addTopicTag(userId, topicId, tagName);
  }

  @UseGuards(UserGuard)
  @Patch('/topics/tags/delete')
  @ApiOperation({ summary: 'delete topic tags' })
  async deleteTopicTag(
    @GetUserIdFromAccessToken() userId: string,
    @Body() dto: DeleteTopicTagDto,
  ) {
    const { topicId, tagName } = dto;

    await this.topicService.deleteTopicTag(userId, topicId, tagName);
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

  @ApiOperation({
    summary:
      'retrieve usedTokenCount by models.if you want to retrieve only with each year, just put year,' +
      'if you want to retrieve with each month, put year and month',
  })
  @Get('/completions/token/counts')
  async retrieveUsedTokenCount(
    @Query() dto: RetrieveUsedTokenCountDto,
    @GetUserIdFromAccessToken() userId: string,
  ) {
    const { year, month, modelnames: modelNames, groupByEachModel } = dto;
    const result = await this.topicService.retrieveUsedTokenCount(
      userId,
      modelNames,
      year,
      month,
      groupByEachModel,
    );
    return new TopicCommonResponseDto().toResponse(result);
  }

  @ApiOperation({
    summary:
      'retrieve fee by models.if you want to retrieve only with each year, just put year,' +
      'if you want to retrieve with each month, put year and month',
  })
  @Get('/completions/fee')
  async retrieveExpectedFees(
    @Query() dto: RetrieveExceptedFeeDto,
    @GetUserIdFromAccessToken() userId: string,
  ) {
    const { year, month, modelnames: modelNames } = dto;
    const result = await this.topicService.retrieveExpectedFee(
      userId,
      modelNames,
      year,
      month,
    );
    return new TopicCommonResponseDto().toResponse(result);
  }

  @Get('/topics/recent')
  @UseGuards(UserGuard)
  @ApiOperation({ summary: 'Retrieve recent topics' })
  async retrieveRecentTopics(
    @Query() dto: RetrieveRecentTopicsTitleDto,
    @GetUserIdFromAccessToken() userId: string,
  ) {
    const topics = await this.topicService.retrieveRecentTopicsTitle(
      dto,
      userId,
    );
    return new TopicCommonResponseDto().toResponse(topics);
  }
  @Get('/topics/:topicId')
  @ApiOperation({ summary: 'Get topic' })
  @ApiParam({ name: 'topicId', type: String, required: true })
  async retrieveTopic(
    @Param('topicId') topicId: string,
    @GetUserIdFromAccessToken() userId: string,
  ) {
    const topic = await this.topicService.retrieveTopic(topicId, userId);
    return new TopicCommonResponseDto().toResponse(topic);
  }

  @Get('/models')
  @ApiOperation({ summary: 'Get models' })
  async retrieveModels() {
    const models = await this.topicService.retrieveModels();
    return new TopicCommonResponseDto().toResponse(models);
  }
}
