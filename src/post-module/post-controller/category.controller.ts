import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateCategoryDto } from '../dto/category.dto';
import { CategoryService } from '../post-service/category.service';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async getAllCategories() {
    return await this.categoryService.getAll();
  }

  @Post()
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return await this.categoryService.create(createCategoryDto);
  }

  @Get(':id/posts')
  async getAllPostsOf(@Param('id') category_id) {
    return await this.categoryService.getPosts(category_id);
  }
}
