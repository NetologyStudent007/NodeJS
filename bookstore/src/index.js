import express from "express";
import config from "./config.js";
import books from "./controllers/books.js";
import path from "node:path";

const __dirname = import.meta.dirname;

const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, `../src/views`));

app.use("/books", books);

app.use((req, res) => {
    res.status(404).render("error", { message: "404. Страница не найдена." });
});

app.listen(config.PORT, () => {
    console.log(`Bookstore started at port: ${config.PORT}`);
});
