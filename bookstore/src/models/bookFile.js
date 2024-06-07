import { Schema, model } from "mongoose";

const bookFileSchema = new Schema({
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

const BookFile = model("BookFile", bookFileSchema);

export default BookFile;
