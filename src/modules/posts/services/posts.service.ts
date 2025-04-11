import { Injectable } from '@nestjs/common';
import { NotFoundException, ForbiddenException } from '../../../common/exceptions';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { v4 as uuidv4 } from 'uuid';
import { BaseService } from '../../../common/abstracts/base.service';
import { PostsRepository, Post } from '../repositories/posts.repository';

@Injectable()
export class PostsService extends BaseService<Post> {
  constructor(private readonly postsRepository: PostsRepository) {
    super(postsRepository);
  }

  async findAll() {
    return this.postsRepository.findAllWithAuthor();
  }

  async findOne(id: string, options?: any): Promise<Post> {
    const post = await this.postsRepository.findOneWithDetails(id);
    if (!post) {
      throw new NotFoundException('Post', id);
    }
    return post as Post;
  }

  async createPost(userId: string, createPostDto: CreatePostDto) {
    const { title, content } = createPostDto;

    return this.repository.create({
      id: uuidv4(),
      title,
      content,
      authorId: userId,
    });
  }

  async updatePost(id: string, userId: string, updatePostDto: UpdatePostDto) {
    // Check if post exists and belongs to user
    const post = await this.repository.findOne(id);

    if (post && post.authorId !== userId) {
      throw new ForbiddenException('You can only update your own posts');
    }

    return this.repository.update(id, updatePostDto);
  }

  async deletePost(id: string, userId: string) {
    // Check if post exists and belongs to user
    const post = await this.repository.findOne(id);

    if (post && post.authorId !== userId) {
      throw new ForbiddenException('You can only delete your own posts');
    }

    return this.repository.delete(id);
  }
  
  async countComments(postId: string): Promise<{ count: number }> {
    const count = await this.postsRepository.countCommentsByPostId(postId);
    return { count };
  }
}
