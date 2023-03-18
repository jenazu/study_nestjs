import { Schema, Document } from 'mongoose';
import { User } from 'src/user-module/models/user.model';
import { Category } from './category.model';

const PostSchema = new Schema(
  {
    title: String,
    description: String,
    content: String,
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    tags: [String],
    numbers: [Number],
    categories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
  },
  {
    timestamps: true,
    collection: 'post',
  },
);

export { PostSchema };

export interface Post extends Document {
  title: string;
  description: string;
  content: string;
  user: User;
  categories: [Category];
  tags: [string];
  numbers: [number];
}
