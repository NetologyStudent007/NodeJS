import { Schema, model } from "mongoose";
import { IBookFile } from "./bookFile";

export interface IBookDto {
    _id: string;
    title: string;
    authors: string;
    description: string;
    favorite: string;
}

export interface IBook extends IBookDto {
    bookFile: IBookFile;
}

const bookSchema = new Schema<IBookDto>({
    title: {
        type: String,
        required: true,
    },
    authors: {
        type: String,
        required: true,
    },
    description: String,
    favorite: String,
});

const Book = model<IBookDto>("Book", bookSchema);

export { Book };
