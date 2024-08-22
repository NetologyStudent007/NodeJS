import { Injectable } from '@nestjs/common';
import { IBook, IBookDto } from './books.interfaces';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class BooksService {
  private store = new Map<IBookDto['id'], IBookDto>();

  constructor() {
    const id = uuidv4();
    this.store.set(id, { id, title: 'Первая книга', author: 'Автор' });
  }

  findAll = (): IBookDto[] => [...this.store.values()];

  getById = (id: IBookDto['id']): IBookDto | undefined => this.store.get(id);

  update = (id: IBookDto['id'], book: IBook): IBookDto | undefined => {
    if (!this.store.has(id)) {
      return undefined;
    }

    const dto = {
      id,
      ...book,
    };

    this.store.set(id, dto);

    return dto;
  };

  patch = (id: IBookDto['id'], book: Partial<IBook>): IBookDto | undefined => {
    const existing = this.store.get(id);
    if (!existing) {
      return undefined;
    }

    const dto = {
      id,
      ...existing,
      ...book,
    };

    this.store.set(id, dto);

    return dto;
  };

  create = (book: IBook): IBookDto => {
    const id = uuidv4();
    const dto = {
      id,
      ...book,
    };

    this.store.set(id, dto);

    return dto;
  };

  delete = (id: IBookDto['id']): boolean => this.store.delete(id);
}
