import Book from "../models/book.js";
import BookFile from "../models/bookFile.js";

class BooksStore {
    addBookAsync = async ({
        title,
        description,
        authors,
        favorite,
        bookFile,
    }) => {
        //тут должна была бы быть транзакция но я пока с ней не разобрался

        const newBook = await new Book({
            title,
            description,
            authors,
            favorite,
        }).save();

        await new BookFile({
            _id: newBook._id,
            data: bookFile.data.toString("base64"),
            mimeType: bookFile.mimeType,
            fileName: bookFile.fileName,
        }).save();

        return newBook;
    };

    getBooksAsync = async () => await Book.find();

    getBookAsync = async (id) => await Book.findById(id);

    getBookFileAsync = async (id) => await BookFile.findById(id);

    deleteBookAsync = async (id) => {
        const book = await Book.findById(id);

        if (book) {
            await Book.deleteOne({ _id: id });
            await BookFile.deleteOne({ _id: id });
        }

        return book;
    };

    updateBookAsync = async ({
        id,
        title,
        description,
        authors,
        favorite,
        bookFile,
    }) => {
        let book = await Book.findById(id);
        if (book) {
            await Book.updateOne(
                { _id: id },
                { title, description, favorite, authors }
            );

            await BookFile.updateOne(
                { _id: id },
                {
                    data: bookFile.data.toString("base64"),
                    mimeType: bookFile.mimeType,
                    fileName: bookFile.fileName,
                }
            );
            return true;
        }
        return false;
    };
}

const bookStore = new BooksStore();

export default bookStore;
