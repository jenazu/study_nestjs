import { Injectable, NotFoundException } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';
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

  async getAllPost(page: number, limit: number, start: string) {
    const count = await this.postRepository.countDocuments({});
    const countPage = (count / limit).toFixed();
    const posts = await this.postRepository.getByCondition(
      {
        _id: {
          $gt: isValidObjectId(start) ? start : '000000000000000000000000',
        },
      },
      null,
      {
        sort: { _id: 1 },
        skip: (Number(page) - 1) * Number(limit),
        limit: Number(limit),
      },
    );
    return { countPage, posts };
  }
  async getPostById(post_id: string) {
    const post = await this.postRepository.findById(post_id);
    if (post) {
      await post
        .populate([
          { path: 'user', select: ' -password -refreshToken ' },
          {
            path: 'categories',
            select: 'title',
            options: { limit: 100, sort: { name: 1 } },
          },
        ])
        .execPopulate();
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
  async getByArray() {
    return await this.postRepository.getByCondition({
      // tags: { $exists: true }, mảng tags có  phần tử ngc lại ko có phần tử thì là truyền false
      // tags: { $size: 2 }, mảng tags có 2 phần tử
      // tags: { $all: ['black', 'blank'] },  trường tags có phần tử là 'black' hoặc 'blank'
      // tags: ['black', 'blank'], trường tags có phần tử là 'black' và 'blank'
      // tags: 'black',  trường tags có phần tử là 'black'
      // $and: [{ numbers: { $gt: 13 } }, { numbers: { $lt: 20 } }],  trường number có phần tử lớn hơn 13 và nhỏ hơn 20
      // numbers: {$gt: 13, $lt: 20}   trường number có phần tử lớn hơn 13 hoặc nhỏ hơn 20
      // numbers: { $elemMatch: { $gt: 16, $lt: 23 } },  trường number có phần tử lớn hơn 16 và nhỏ hơn 23
      // 'numbers.0': { $gt: 12 }, có thể làm để chấm vào obj còn đây là chấm vào vị trí đầu tiền của mảng numbers lớn hơn 12
    });
  }
}
