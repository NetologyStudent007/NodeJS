import "reflect-metadata";
import { injectable } from "inversify";
import { IBook, IBookDto, Book } from "../models/book.js";
import { IBookFileDto, BookFile } from "../models/bookFile.js";

@injectable()
export class BooksRepository {
    addBookAsync = async ({
        title,
        description,
        authors,
        favorite,
        bookFile,
    }: Omit<IBook, "_id">): Promise<IBookDto> => {
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

    getBookAsync = async (id: IBookDto["_id"]) => await Book.findById(id);

    getBookFileAsync = async (id: IBookFileDto["_id"]) =>
        await BookFile.findById(id);

    deleteBookAsync = async (id: IBookDto["_id"]) => {
        const book = await Book.findById(id);

        if (book) {
            await Book.deleteOne({ _id: id });
            await BookFile.deleteOne({ _id: id });
        }

        return book;
    };

    updateBookAsync = async ({
        _id,
        title,
        description,
        authors,
        favorite,
        bookFile,
    }: IBook): Promise<boolean> => {
        let book = await Book.findById(_id);
        if (book) {
            await Book.updateOne(
                { _id },
                { title, description, favorite, authors }
            );

            await BookFile.updateOne(
                { _id },
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
