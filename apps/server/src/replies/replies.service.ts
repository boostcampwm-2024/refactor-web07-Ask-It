import { Injectable } from '@nestjs/common';

import { CreateReplyDto } from './dto/create-reply.dto';
import { UpdateReplyBodyDto } from './dto/update-reply.dto';
import { RepliesRepository } from './replies.repository';

import { Roles } from '@common/roles/roles';
import { SessionsAuthRepository } from '@sessions-auth/sessions-auth.repository';

@Injectable()
export class RepliesService {
  constructor(
    private readonly repliesRepository: RepliesRepository,
    private readonly sessionAuthRepository: SessionsAuthRepository,
  ) {}

  async createReply(data: CreateReplyDto) {
    const { replyId, body, createdAt, createUserTokenEntity, deleted, questionId } =
      await this.repliesRepository.createReply(data);
    return {
      userId: createUserTokenEntity?.user?.userId || null,
      replyId,
      body,
      createdAt,
      isOwner: true,
      likesCount: 0,
      liked: false,
      deleted,
      questionId,
      nickname: createUserTokenEntity?.user?.nickname || '익명',
    };
  }

  async updateBody(replyId: number, updateReplyBodyDto: UpdateReplyBodyDto) {
    const { body } = updateReplyBodyDto;
    return await this.repliesRepository.updateBody(replyId, body);
  }

  async deleteReply(replyId: number) {
    return await this.repliesRepository.deleteReply(replyId);
  }

  async validateHost(token: string) {
    const { roleType } = await this.sessionAuthRepository.findByToken(token);
    return roleType === Roles.SUPER_HOST || roleType === Roles.SUB_HOST;
  }

  async toggleLike(replyId: number, createUserToken: string) {
    const exist = await this.repliesRepository.findLike(replyId, createUserToken);
    const liked = !exist;
    const { reply } = exist
      ? await this.repliesRepository.deleteLike(exist.replyLikeId)
      : await this.repliesRepository.createLike(replyId, createUserToken);
    return { liked, questionId: reply.questionId };
  }

  async getLikesCount(replyId: number) {
    return this.repliesRepository.getLikesCount(replyId);
  }
}
