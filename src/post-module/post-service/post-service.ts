import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from 'src/user-module/models/user.model';
import { UpdatePostDto } from '../dto/post.dto';
import { CategoryRepository } from '../repositories/category.repository';
import { PostRepository } from '../repositories/post.repository';
import { CreatePostDto } from './../dto/post.dto';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async getAllPost() {
    return this.postRepository.getByCondition({});
  }
  async getPostById(post_id: string) {
    const post = await this.postRepository.findById(post_id);
    if (post) {
      await post.populate({ path: 'user', select: '-password' }).execPopulate();
      return post;
    } else {
      // throw new PostNotFoundException(post_id);
      throw new NotFoundException(post_id);
    }
    // throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
  }
  async replacePost(post_id: string, data: UpdatePostDto) {
    return await this.postRepository.findByIdAndUpdate(post_id, data);
  }
  async deletePost(post_id: string) {
    return await this.postRepository.deleteOne(post_id);
  }
  async createPost(user: User, post: CreatePostDto) {
    post.user = user._id;
    const new_post = await this.postRepository.create(post);
    if (post.categories) {
      await this.categoryRepository.updateMany(
        {
          _id: { $in: post.categories },
        },
        {
          $push: {
            posts: new_post._id,
          },
        },
      );
    }
    return new_post;
  }

  async getByCategory(category_id: string) {
    return await this.postRepository.getByCondition({
      categories: {
        $elemMatch: { $eq: category_id },
      },
    });
  }

  async getByCategories(category_ids: [string]) {
    return await this.postRepository.getByCondition({
      categories: {
        $all: category_ids,
      },
    });
  }
}
