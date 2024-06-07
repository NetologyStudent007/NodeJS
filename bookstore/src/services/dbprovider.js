import mongoose from "mongoose";
import Book from "../models/book.js";
import BookFile from "../models/bookFile.js";

class MongoDBProvider {
    connection = undefined;

    connectAsync = async (connectionUrl) => {
        this.connection = await mongoose.connect(connectionUrl);

        await Book.createCollection();
        await BookFile.createCollection();

        return this.connection;
    };

    getConnection = () => this.connection;
}

const dbProvider = new MongoDBProvider();

export default dbProvider;
