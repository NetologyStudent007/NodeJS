import { Container } from "inversify";
import { BooksRepository } from "./repo/booksRepository";
import { MongoDBProvider } from "./services/dbprovider";

const container = new Container();

container.bind(BooksRepository).toSelf().inSingletonScope();
container.bind(MongoDBProvider).toSelf().inSingletonScope();

export { container };
