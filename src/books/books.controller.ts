import { Body, Controller, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { BooksService } from './books.service';
import { IBook, IBookDto } from './books.interfaces';

@Controller('books')
export class BooksController {
  constructor(private readonly _booksService: BooksService) {}

  @Get()
  findAll(): IBookDto[] {
    return this._booksService.findAll();
  }

  @Get('/:id')
  getById(@Param('id') id: IBookDto['id']): IBookDto {
    return this._booksService.getById(id);
  }

  @Post()
  create(@Body() book: IBook): IBookDto {
    return this._booksService.create(book);
  }

  @Put('/:id')
  update(
    @Param('id') id: IBookDto['id'],
    @Body() book: IBook,
  ): IBookDto | undefined {
    return this._booksService.update(id, book);
  }

  @Patch('/:id')
  patch(
    @Param('id') id: IBookDto['id'],
    @Body() book: Partial<IBook>,
  ): IBookDto | undefined {
    return this._booksService.patch(id, book);
  }
}
