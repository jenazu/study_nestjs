import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/base.repository';
import { Category } from '../models/category.model';

@Injectable()
export class CategoryRepository extends BaseRepository<Category> {
  constructor(
    @InjectModel('Category')
    private readonly CategoryModule: Model<Category>,
  ) {
    super(CategoryModule);
  }
}
