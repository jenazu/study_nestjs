import { PaginationPostDto } from './../dto/post.dto';
import { AuthGuard } from '@nestjs/passport';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { HttpExceptionFilter } from 'src/utils/httpException.filter';
import { CreatePostDto, UpdatePostDto } from '../dto/post.dto';
import { PostService } from '../post-service/post-service';

@Controller('post')
export class PostsController {
  constructor(private readonly postService: PostService) {}
  @Get()
  getAllPost(@Query() { page, limit, start }: PaginationPostDto) {
    return this.postService.getAllPost(page, limit, start);
  }

  @Get(':id')
  @UseFilters(HttpExceptionFilter)
  getPostById(@Param('id') id: string) {
    return this.postService.getPostById(id);
  }
  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createPost(@Req() req: any, @Body() post: CreatePostDto) {
    return this.postService.createPost(req.user, post);
  }
  @Put(':id')
  async replacePost(@Param('id') id: string, @Body() post: UpdatePostDto) {
    return this.postService.replacePost(id, post);
  }
  @Delete(':id')
  async deletePost(@Param('id') id: string) {
    this.postService.deletePost(id);
    return true;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('user/all')
  async getPostUser(@Req() req: any) {
    await req.user
      .populate([
        {
          path: 'posts',
          // select: 'title'
        },
      ])
      .execPopulate();
    return req.user.posts;
  }

  @Get('get/category')
  async getByCategory(@Query('category_id') category_id) {
    return await this.postService.getByCategory(category_id);
  }

  @Get('get/categories')
  async getByCategories(@Query('category_ids') category_ids) {
    return await this.postService.getByCategories(category_ids);
  }
  @Get('get/array')
  async getByArray() {
    return this.postService.getByArray();
  }
}
