import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/base.repository';
import { Post } from '../models/post.model';

@Injectable()
export class PostRepository extends BaseRepository<Post> {
  constructor(
    @InjectModel('Post')
    private readonly PostModule: Model<Post>,
  ) {
    super(PostModule);
  }

  async countDocuments(filter) {
    return this.PostModule.countDocuments(filter);
  }
}
