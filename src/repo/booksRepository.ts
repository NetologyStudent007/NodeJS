import "reflect-metadata";
import { injectable } from "inversify";
import { IBook, IBookDto, Book } from "../models/book";
import { IBookFileDto, BookFile } from "../models/bookFile";

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

        return newBook.toObject();
    };

    getBooksAsync = async (): Promise<IBookDto[]> =>
        (await Book.find()).map((book) => book.toObject());

    getBookAsync = async (id: IBookDto["_id"]): Promise<IBookDto | undefined> =>
        (await Book.findById(id))?.toObject();

    getBookFileAsync = async (
        id: IBookFileDto["_id"]
    ): Promise<IBookFileDto | undefined> =>
        (await BookFile.findById(id))?.toObject();

    deleteBookAsync = async (
        id: IBookDto["_id"]
    ): Promise<IBookDto | undefined> => {
        const book = await Book.findById(id);

        if (book) {
            await Book.deleteOne({ _id: id });
            await BookFile.deleteOne({ _id: id });
        }

        return book?.toObject();
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
