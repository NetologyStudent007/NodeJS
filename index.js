import express from "express";
import config from "./config.js";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session from "express-session";
import books from "./controllers/books.js";
import users from "./controllers/users.js";
import usersStore from "./repo/usersStore.js";

const verify = async (username, password, done) => {
    try {
        const user = await usersStore.verifyUserAsync(username, password);
        if (!user) {
            done(null, false);
        } else {
            done(null, user);
        }
    } catch {
        done(err);
    }
};

const options = {
    usernameField: "username",
    passwordField: "password",
};

passport.use("local", new LocalStrategy(options, verify));

passport.serializeUser((user, cb) => {
    cb(null, user.username);
});

passport.deserializeUser(async (username, cb) => {
    try {
        const user = await usersStore.getUserAsync(username);
        cb(null, user);
    } catch {
        cb(err);
    }
});

const app = express();
app.set("view engine", "ejs");

app.use(
    session({
        secret: "SECRET",
        resave: true,
        saveUninitialized: true,
    })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/user", users);
app.use("/books", books);

app.use((req, res) => {
    res.status(404).render("error", { message: "404. Страница не найдена" });
});

app.listen(config.PORT, () => {
    console.log(`Server started at port: ${config.PORT}`);
});
