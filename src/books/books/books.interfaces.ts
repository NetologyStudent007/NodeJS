export interface IBook {
  title: string;
  author: string;
}

export interface IBookDto extends IBook {
  id: string;
}
