import "reflect-metadata";
import { decorate, injectable, Container } from "inversify";
import { BooksRepository } from "./repo/booksRepository.js";

const container = new Container();

decorate(injectable(), BooksRepository);
container.bind(BooksRepository).toSelf();

export { container };
