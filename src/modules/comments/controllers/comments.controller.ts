import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards, HttpStatus } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { LoggerService } from '../../../logger/logger.service';
import { CommentsService } from '../services/comments.service';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { UpdateCommentDto } from '../dto/update-comment.dto';

@Controller('posts/:postId/comments')
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
    private readonly logger: LoggerService
  ) {
    this.logger.setContext('CommentsController');
  }

  @Get()
  async findByPostId(@Param('postId') postId: string) {
    this.logger.debug(`Finding comments for post: ${postId}`);
    const comments = await this.commentsService.findByPostId(postId);
    return {
      success: true,
      data: comments
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Request() req,
    @Param('postId') postId: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    const userId = req.user.userId;
    this.logger.debug(`Creating comment for post: ${postId} by user: ${userId}`);
    const comment = await this.commentsService.createComment(
      postId,
      userId,
      createCommentDto,
    );
    
    return {
      success: true,
      data: comment
    };
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    const userId = req.user.userId;
    this.logger.debug(`Updating comment: ${id} by user: ${userId}`);
    const comment = await this.commentsService.updateComment(
      id,
      userId,
      updateCommentDto,
    );
    
    return {
      success: true,
      data: comment
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(
    @Request() req, 
    @Param('postId') postId: string,
    @Param('id') id: string
  ) {
    const userId = req.user.userId;
    this.logger.debug(`Deleting comment: ${id} by user: ${userId}`);
    const comment = await this.commentsService.deleteComment(id, userId);
    
    return {
      success: true,
      data: comment
    };
  }
}
