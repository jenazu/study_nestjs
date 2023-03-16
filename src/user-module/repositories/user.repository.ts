import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/base.repository';
import { User } from '../models/user.model';

@Injectable()
export class UserRepository extends BaseRepository<User> {
  constructor(
    @InjectModel('User')
    private readonly userModule: Model<User>,
  ) {
    super(userModule);
  }
}
