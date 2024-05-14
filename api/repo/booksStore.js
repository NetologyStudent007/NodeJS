import Book from "../models/book.js";

export default class BooksStore {
    books = [];

    addBook = ({
        title,
        description,
        authors,
        favorite,
        fileCover,
        fileName
    }) => {

        const newBook = new Book(title,
            description,
            authors,
            favorite,
            fileCover,
            fileName);

        this.books.push(newBook);

        return newBook;
    }

    getBooks = () => this.books;

    getBook = (id) => this.books.find(f => f.id == id);

    deleteBook = (id) => {
        const idx = this.books.findIndex(f => f.id === id);
        if (idx !== -1) {
            return this.books.splice(idx, 1)[0];
        }
        return undefined;
    }

    updateBook = ({
        id,
        title,
        description,
        authors,
        favorite,
        fileCover,
        fileName
    }) => {
        const idx = this.books.findIndex(f => f.id == id);
        if (idx == -1) {
            return undefined;
        } else {
            this.books[idx] = {
                id,
                title,
                description,
                authors,
                favorite,
                fileCover,
                fileName
            }
            return this.books[idx];
        }
    }
}