import { Injectable } from '@nestjs/common';
import { NotFoundException, ForbiddenException } from '../../../common/exceptions';
import { v4 as uuidv4 } from 'uuid';
import { BaseService } from '../../../common/abstracts/base.service';
import { CommentsRepository, Comment } from '../repositories/comments.repository';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { UpdateCommentDto } from '../dto/update-comment.dto';

@Injectable()
export class CommentsService extends BaseService<Comment> {
  constructor(private readonly commentsRepository: CommentsRepository) {
    super(commentsRepository);
  }

  async findAll(options?: any): Promise<Comment[]> {
    return super.findAll(options);
  }

  async findOne(id: string, options?: any): Promise<Comment> {
    const comment = await this.repository.findOne(id, options);
    if (!comment) {
      throw new NotFoundException('Comment', id);
    }
    return comment;
  }

  async findByPostId(postId: string): Promise<Comment[]> {
    return this.commentsRepository.findByPostId(postId);
  }

  async createComment(postId: string, userId: string, createCommentDto: CreateCommentDto): Promise<any> {
    const { content } = createCommentDto;

    const newComment = await this.repository.create({
      id: uuidv4(),
      content,
      postId,
      authorId: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
    });

    const user = await this.commentsRepository.getUserById(userId);

    return {
      ...newComment,
      users: user
    };
  }

  async updateComment(id: string, userId: string, updateCommentDto: UpdateCommentDto): Promise<Comment> {
    const comment = await this.repository.findOne(id, { includeDeleted: true });

    if (!comment) {
      throw new NotFoundException('Comment', id);
    }

    if (comment.authorId !== userId) {
      throw new ForbiddenException('You can only update your own comments');
    }

    if (comment.isDeleted === true) {
      throw new ForbiddenException('Cannot update a deleted comment');
    }

    return this.repository.update(id, {
      ...updateCommentDto,
      updatedAt: new Date(),
    });
  }

  async deleteComment(id: string, userId: string): Promise<Comment> {
    const comment = await this.repository.findOne(id, { includeDeleted: true });

    if (!comment) {
      throw new NotFoundException('Comment', id);
    }

    if (comment.authorId !== userId) {
      throw new ForbiddenException('You can only delete your own comments');
    }

    if (comment.isDeleted === true) {
      return comment;
    }

    return this.repository.update(id, {
      isDeleted: true,
      updatedAt: new Date()
    });
  }
}
