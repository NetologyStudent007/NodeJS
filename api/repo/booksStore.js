import Book from "../models/book.js";

export default class BooksStore {
    books = new Map();
    filesStore = new Map();

    addBook = ({
        title,
        description,
        authors,
        favorite,
        bookFile
    }) => {

        const newBook = new Book(title,
            description,
            authors,
            favorite);

        this.books.set(newBook.id, newBook);
        this.filesStore.set(newBook.id, bookFile);

        return newBook;
    }

    getBooks = () => [...this.books.values()];

    getBook = (id) => this.books.get(id);

    getBookFile = (id) => this.filesStore.get(id);

    deleteBook = (id) => {
        const book = this.books.get(id);
        if (book) {
            this.filesStore.delete(book.id);
            this.books.delete(book.id);
            return book;
        }
        return undefined;
    }

    updateBook = ({
        id,
        title,
        description,
        authors,
        favorite,
        bookFile
    }) => {
        const book = this.books.get(id);
        if (!book) {
            return undefined;
        } else {
            const updated = {
                id,
                title,
                description,
                authors,
                favorite
            }
            this.books.set(id, updated);
            this.filesStore.set(id, bookFile);
            return updated;
        }
    }
}