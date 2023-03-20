import { CreatePostHandler } from './handler/createPost.handler';
import { CacheModule, Module } from '@nestjs/common';
import { PostService } from './post-service/post-service';
import { PostsController } from './post-controller/post-controller.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PostSchema } from './models/post.model';
import { PostRepository } from './repositories/post.repository';
import { CategorySchema } from './models/category.model';
import { CategoryRepository } from './repositories/category.repository';
import { CategoryService } from './post-service/category.service';
import { CategoryController } from './post-controller/category.controller';
import { UserModuleModule } from 'src/user-module/user-module.module';
import { CqrsModule } from '@nestjs/cqrs';
import { GetPostHandler } from './handler/getPost.handler';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';

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
    UserModuleModule,
    CqrsModule,
    // CacheModule.register({
    //   ttl: 10,
    // }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        // isGlobal: true,
        store: redisStore,
        host: configService.get<string>('REDIS_HOST'),
        port: configService.get<number>('REDIS_PORT'),
        username: configService.get<string>('REDIS_USERNAME'),
        password: configService.get<string>('REDIS_PASSWORD'),
      }),
    }),
  ],
  providers: [
    PostService,
    PostRepository,
    CategoryRepository,
    CategoryService,
    CreatePostHandler,
    GetPostHandler,
  ],
  controllers: [PostsController, CategoryController],
})
export class PostModule {}
