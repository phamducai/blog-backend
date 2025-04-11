import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { BaseRepository } from '../../../common/abstracts/base.repository';


export type Post = {
  id: string;
  title: string;
  content: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class PostsRepository extends BaseRepository<Post> {
  constructor(private readonly prismaService: PrismaService) {
    super(prismaService, 'posts');
  }

  async findAllWithAuthor() {
    return this.prismaService.posts.findMany({
      where: {
        isDeleted: false
      },
      include: {
        users: {
          select: {
            id: true,
            email: true
          }
        },
        _count: {
          select: {
            comments: {
              where: {
                isDeleted: false
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc' 
      }
    });
  }

  async findOneWithDetails(id: string) {
    console.log(`Finding post with id: ${id} including details`);
    
    const result = await this.prismaService.posts.findUnique({
      where: { id },
      include: {
        users: {
          select: {
            id: true,
            email: true
          }
        },
        comments: {
          where: {
            isDeleted: false 
          },
          take: 10, 
          orderBy: {
            createdAt: 'desc' 
          },
          include: {
            users: {
              select: {
                id: true,
                email: true
              }
            }
          }
        }
      }
    });
    
    return result;
  }

  async countCommentsByPostId(postId: string): Promise<number> {
    return this.prismaService.comments.count({
      where: { 
        postId,
        isDeleted: false
      }
    });
  }
}
