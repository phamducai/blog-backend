import { IsOptional, IsString } from 'class-validator';

export class UpdateCommentDto {
  @IsOptional()
  @IsString({ message: 'Content must be a string' })
  content?: string;
}
