import { Injectable } from '@nestjs/common';
import { ICreateBookDto, IUpdateBookDto } from './interfaces/book';
import { InjectModel } from '@nestjs/mongoose';
import { Book } from './schemas/book';
import { Model } from 'mongoose';

@Injectable()
export class BooksService {
  constructor(@InjectModel(Book.name) private _bookModel: Model<Book>) {}

  findAll = (): Promise<Book[]> => this._bookModel.find().exec();

  getById = (id: Book['id']): Promise<Book | undefined> =>
    this._bookModel.findById(id);

  update = (id: Book['id'], book: IUpdateBookDto): Promise<Book | undefined> =>
    this._bookModel.findByIdAndUpdate(id, book, { new: true }).exec();

  patch = async (
    id: Book['id'],
    book: Partial<IUpdateBookDto>,
  ): Promise<Book | undefined> => {
    const existing = await this._bookModel.findById(id);
    if (!existing) {
      return undefined;
    }

    return this._bookModel
      .findByIdAndUpdate(
        id,
        {
          ...existing.toObject(),
          ...book,
        },
        { new: true },
      )
      .exec();
  };

  create = (book: ICreateBookDto): Promise<Book> =>
    this._bookModel.create(book);

  delete = async (id: Book['id']): Promise<boolean> => {
    const book: Book = await this._bookModel.findByIdAndDelete(id);
    return book ? true : false;
  };
}
