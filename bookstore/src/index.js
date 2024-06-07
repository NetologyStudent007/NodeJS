import express from "express";
import config from "./config.js";
import books from "./controllers/books.js";
import path from "node:path";
import dbProvider from "./services/dbprovider.js";

const __dirname = import.meta.dirname;

const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, `../src/views`));

app.use("/books", books);

app.use((req, res) => {
    res.status(404).render("error", { message: "404. Страница не найдена." });
});

app.use((error, req, res, next) => {
    res.status(error.status || 500).render("error", {
        message: "500. Внутренняя ошибка сервера.",
    });
});

(async () => {
    try {
        await dbProvider.connectAsync(config.MONGO_CONNECTION_STRING);
        app.listen(config.PORT, () => {
            console.log(`Bookstore started at port: ${config.PORT}`);
        });
    } catch (ex) {
        console.log(ex);
    }
})();
