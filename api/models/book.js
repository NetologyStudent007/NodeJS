import { v4 as uuid } from 'uuid';

export default class Book {

    constructor(
        title,
        description,
        authors,
        favorite,
        fileCover,
        fileName
    ) {
        this.id = uuid();
        this.title = title;
        this.description = description;
        this.authors = authors;
        this.favorite = favorite;
        this.fileCover = fileCover;
        this.fileName = fileName;
    }
}