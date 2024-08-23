import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { Book } from './schemas/book';
import { ICreateBookDto, IUpdateBookDto } from './interfaces/book';

@Controller('books')
export class BooksController {
  constructor(private readonly _booksService: BooksService) {}

  @Get()
  findAll(): Promise<Book[]> {
    return this._booksService.findAll();
  }

  @Get('/:id')
  getById(@Param('id') id: Book['id']): Promise<Book> {
    return this._booksService.getById(id);
  }

  @Post()
  create(@Body() book: ICreateBookDto): Promise<Book> {
    return this._booksService.create(book);
  }

  @Put('/:id')
  update(
    @Param('id') id: Book['id'],
    @Body() book: IUpdateBookDto,
  ): Promise<Book | undefined> {
    return this._booksService.update(id, book);
  }

  @Patch('/:id')
  patch(
    @Param('id') id: Book['id'],
    @Body() book: Partial<Book>,
  ): Promise<Book | undefined> {
    return this._booksService.patch(id, book);
  }

  @Delete('/:id')
  delete(@Param('id') id: Book['id']): Promise<boolean> {
    return this._booksService.delete(id);
  }
}
