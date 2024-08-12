import { Schema, model } from "mongoose";

export interface IBookFileDto {
    _id: string;
    data: string;
    mimeType: string;
    fileName: string;
}

export interface IBookFile extends Omit<IBookFileDto, "data"> {
    data: Buffer;
}

const bookFileSchema = new Schema<IBookFileDto>({
    data: {
        type: String,
        required: true,
    },
    mimeType: {
        type: String,
        required: true,
    },
    fileName: {
        type: String,
        required: true,
    },
});

const BookFile = model<IBookFileDto>("BookFile", bookFileSchema);

export { BookFile };
