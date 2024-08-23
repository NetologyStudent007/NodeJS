/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface IBook {
  id: string;
  title: string;
  author: string;
}

export interface ICreateBookDto extends Omit<IBook, 'id'> {}
export interface IUpdateBookDto extends ICreateBookDto {}
