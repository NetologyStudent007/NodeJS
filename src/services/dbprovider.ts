import "reflect-metadata";
import mongoose, { Mongoose } from "mongoose";
import { Book } from "../models/book";
import { BookFile } from "../models/bookFile";
import config from "../config";
import { injectable } from "inversify";

@injectable()
export class MongoDBProvider {
    private connection?: Mongoose;

    getConnectionAsync = async (): Promise<Mongoose> => {
        if (!this.connection) {
            this.connection = await mongoose.connect(
                config.MONGO_CONNECTION_STRING
            );

            await Book.createCollection();
            await BookFile.createCollection();
        }
        return this.connection;
    };
}
