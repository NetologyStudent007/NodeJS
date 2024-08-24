import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IBook } from '../interfaces/book';

export type BookDocument = Document<Book>;

@Schema({
  toJSON: {
    virtuals: true,
    transform: (_doc, obj) => {
      delete obj.__v;
      delete obj._id;
      return obj;
    },
  },
  toObject: {
    virtuals: true,
  },
})
export class Book implements IBook {
  @Prop({ required: true })
  public title: string;

  @Prop({ required: true })
  public author: string;

  id: string;
}

const BookSchema = SchemaFactory.createForClass(Book);

BookSchema.virtual<BookDocument>('id').get(function () {
  return this._id;
});

export { BookSchema };
