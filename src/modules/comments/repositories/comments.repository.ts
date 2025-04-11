import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { BaseRepository } from '../../../common/abstracts/base.repository';

// Định nghĩa kiểu dữ liệu Comment
export interface Comment {
  id: string;
  content: string;
  postId: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  users?: {
    id: string;
    email: string;
  };
}

@Injectable()
export class CommentsRepository extends BaseRepository<Comment> {
  constructor(private readonly prismaService: PrismaService) {
    super(prismaService, 'comments');
  }

  async findByPostId(postId: string): Promise<Comment[]> {    
    const comments = await this.prismaService.comments.findMany({
      where: { postId, isDeleted: false },
      include: {
        users: {
          select: {
            id: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'asc' 
      }
    });
    return comments;
  }
  
  async getUserById(userId: string) {
    return this.prismaService.users.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true
      }
    });
  }
}
