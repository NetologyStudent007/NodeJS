import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { IBook } from '../interfaces/book';

export type BookDocument = Document<Book>;

@Schema()
export class Book implements IBook {
  private _id: Types.ObjectId;

  @Prop({ required: true })
  public title: string;

  @Prop({ required: true })
  public author: string;

  //тут попытался сделать возможность работать с полем _id как с id но сериализовать пока не удалось так как хотелось бы

  public get id(): string {
    return this._id.toString();
  }

  public set id(id: string) {
    this._id = new Types.ObjectId(id);
  }
}

export const BookSchema = SchemaFactory.createForClass(Book);
