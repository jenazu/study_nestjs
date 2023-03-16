import { Module } from '@nestjs/common';
import { PostService } from './post-service/post-service';
import { PostsController } from './post-controller/post-controller.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PostSchema } from './models/post.model';
import { PostRepository } from './repositories/post.repository';
import { CategorySchema } from './models/category.model';
import { CategoryRepository } from './repositories/category.repository';
import { CategoryService } from './post-service/category.service';
import { CategoryController } from './post-controller/category.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Post',
        schema: PostSchema,
      },
      {
        name: 'Category',
        schema: CategorySchema,
      },
    ]),
  ],
  providers: [PostService, PostRepository, CategoryRepository, CategoryService],
  controllers: [PostsController, CategoryController],
})
export class PostModule {}
