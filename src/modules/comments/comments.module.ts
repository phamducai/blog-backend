import { Module } from '@nestjs/common';
import { CommentsService } from './services/comments.service';
import { CommentsController } from './controllers/comments.controller';
import { CommentsRepository } from './repositories/comments.repository';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [CommentsController],
  providers: [CommentsService, CommentsRepository, PrismaService],
  exports: [CommentsService]
})
export class CommentsModule {}
