import { IBook } from "../interfaces/iBook"
import { IBookDto } from "../interfaces/iBookDto"

export abstract class BooksRepository {
    abstract createBook(book: IBook): IBookDto;
    abstract getBook(id: IBookDto['id'] ): IBookDto;
    abstract getBooks(): IBookDto[];
    abstract updateBook(id: IBookDto['id'], book: Partial<IBook>): IBookDto;
    abstract deleteBook(id: IBookDto['id']): boolean;
}