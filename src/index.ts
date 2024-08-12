import express, { ErrorRequestHandler } from "express";
import config from "./config";
import books from "./controllers/books";
import { container } from "./iocContainer";
import { MongoDBProvider } from "./services/dbprovider";
import path from "path";

const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, `../dist/views`));

app.use("/books", books);

app.use((_req, res) => {
    res.status(404).render("error", { message: "404. Страница не найдена." });
});

app.use(((error, _req, res, _next) => {
    console.log(error);
    res.status(error.status || 500).render("error", {
        message: "500. Внутренняя ошибка сервера.",
    });
}) as ErrorRequestHandler);

(async () => {
    try {
        await container.get(MongoDBProvider).getConnectionAsync();
        app.listen(config.PORT, () => {
            console.log(`Bookstore started at port: ${config.PORT}`);
        });
    } catch (ex) {
        console.log(ex);
    }
})();
