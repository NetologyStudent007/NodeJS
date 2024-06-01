import { v4 as uuid } from 'uuid';

export default class Book {

   // модель хранения пришлось чуть изменить
   // сover убрал пока

    constructor(
        title,
        description,
        authors,
        favorite
    ) {
        this.id = uuid();
        this.title = title;
        this.description = description;
        this.authors = authors;
        this.favorite = favorite;
    }
}