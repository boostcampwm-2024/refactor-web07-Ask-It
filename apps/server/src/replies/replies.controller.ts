import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';

import { CreateReplyDto } from './dto/create-reply.dto';
import { ToggleReplyLikeDto } from './dto/toggle-reply-like.dto';
import { UpdateReplyBodyDto } from './dto/update-reply.dto';
import { ReplyExistenceGuard } from './guards/reply-existence.guard';
import { RepliesService } from './replies.service';
import { CreateReplySwagger } from './swagger/create-reply.swagger';
import { DeleteReplySwagger } from './swagger/delete-reply.swagger';
import { ToggleReplyLikeSwagger } from './swagger/toggle-reply.swagger';
import { UpdateReplySwagger } from './swagger/update-reply.swagger';

import { BaseDto } from '@common/base.dto';
import { RequireOwnership } from '@common/decorators/require-ownership.decorator';
import { RequirePermission } from '@common/decorators/require-permission.decorator';
import { OwnershipGuard } from '@common/guards/ownership.guard';
import { PermissionOrOwnershipGuard } from '@common/guards/permission-or-ownership.guard';
import { SessionTokenValidationGuard } from '@common/guards/session-token-validation.guard';
import { TransformInterceptor } from '@common/interceptors/transform.interceptor';
import { requestSocket } from '@common/request-socket';
import { Permissions } from '@common/roles/permissions';
import { QuestionExistenceGuard } from '@questions/guards/question-existence.guard';
import { SOCKET_EVENTS } from '@socket/socket.constant';

@ApiTags('Replies')
@UseInterceptors(TransformInterceptor)
@Controller('replies')
export class RepliesController {
  constructor(private readonly repliesService: RepliesService) {}

  @Post()
  @CreateReplySwagger()
  @ApiBody({ type: CreateReplyDto })
  @UseGuards(SessionTokenValidationGuard, QuestionExistenceGuard)
  async create(@Body() createReplyDto: CreateReplyDto) {
    const [reply, isHost] = await Promise.all([
      this.repliesService.createReply(createReplyDto),
      this.repliesService.validateHost(createReplyDto.token),
    ]);
    const resultForOwner = { reply: { ...reply, isHost } };
    const resultForOther = { reply: { ...reply, isHost, isOwner: false } };
    const { sessionId, token } = createReplyDto;
    await requestSocket({ sessionId, token, event: SOCKET_EVENTS.REPLY_CREATED, content: resultForOther });
    return resultForOwner;
  }

  @Patch(':replyId/body')
  @UpdateReplySwagger()
  @ApiBody({ type: UpdateReplyBodyDto })
  @RequireOwnership()
  @UseGuards(SessionTokenValidationGuard, ReplyExistenceGuard, OwnershipGuard)
  async update(@Param('replyId', ParseIntPipe) replyId: number, @Body() updateReplyBodyDto: UpdateReplyBodyDto) {
    const updatedReply = await this.repliesService.updateBody(replyId, updateReplyBodyDto);
    const { sessionId, token } = updateReplyBodyDto;
    const result = { reply: updatedReply };
    await requestSocket({ sessionId, token, event: SOCKET_EVENTS.REPLY_UPDATED, content: result });
    return result;
  }

  @Delete(':replyId')
  @DeleteReplySwagger()
  @RequirePermission(Permissions.DELETE_REPLY)
  @UseGuards(SessionTokenValidationGuard, ReplyExistenceGuard, PermissionOrOwnershipGuard)
  async delete(@Param('replyId', ParseIntPipe) replyId: number, @Query() data: BaseDto) {
    const { sessionId, token } = data;
    const { questionId } = await this.repliesService.deleteReply(replyId);
    const resultForOther = { replyId, questionId };
    await requestSocket({ sessionId, token, event: SOCKET_EVENTS.REPLY_DELETED, content: resultForOther });
    return {};
  }

  @Post(':replyId/likes')
  @ToggleReplyLikeSwagger()
  @UseGuards(SessionTokenValidationGuard)
  async toggleLike(@Param('replyId', ParseIntPipe) replyId: number, @Body() toggleReplyLikeDto: ToggleReplyLikeDto) {
    const { liked, questionId } = await this.repliesService.toggleLike(replyId, toggleReplyLikeDto.token);
    const likesCount = await this.repliesService.getLikesCount(replyId);
    const { sessionId, token } = toggleReplyLikeDto;
    const resultForOwner = { liked, likesCount };
    const resultForOther = { replyId, liked: false, likesCount, questionId };
    const event = SOCKET_EVENTS.REPLY_LIKED;
    await requestSocket({ sessionId, token, event, content: resultForOther });
    return resultForOwner;
  }
}
