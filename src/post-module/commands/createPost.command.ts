import { User } from 'src/user-module/models/user.model';
import { CreatePostDto } from '../dto/post.dto';

export class CreatePostCommand {
  constructor(
    public readonly user: User,
    public readonly createPostDto: CreatePostDto,
  ) {}
}
