import express from "express";
import config from "./config.js";
import books from "./controllers/books.js";
import users from "./controllers/users.js";
import initAuth from "./auth/auth.js";

const app = express();
app.set("view engine", "ejs");

initAuth(app);

app.use("/user", users);
app.use("/books", books);

app.use((req, res) => {
    res.status(404).render("error", { message: "404. Страница не найдена" });
});

app.listen(config.PORT, () => {
    console.log(`Server started at port: ${config.PORT}`);
});
