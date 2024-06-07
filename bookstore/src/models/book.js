import { Schema, model } from "mongoose";

const bookSchema = new Schema({
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

const Book = model("Book", bookSchema);

export default Book;
