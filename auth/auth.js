import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session from "express-session";
import usersStore from "../repo/usersStore.js";
import config from "../config.js";

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

const initAuth = (app) => {
    app.use(
        session({
            secret: config.SESSION_SECRET,
            resave: true,
            saveUninitialized: true,
        })
    );
    app.use(passport.initialize());
    app.use(passport.session());
};

export default initAuth;
