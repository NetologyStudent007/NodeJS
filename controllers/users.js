import express from "express";
import passport from "passport";

const router = express.Router();
router.use(express.urlencoded({ extended: true }));

router.get("/login", (req, res) => {
    res.render("login", {});
});

router.post(
    "/login",
    passport.authenticate("local", {
        failureRedirect: "/user/login",
        successRedirect: "/books",
        failureMessage: "test",
    })
);

router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect(req.headers.referer);
    });
});

router.get("/me", (req, res) => {
    if (req.isAuthenticated()) {
        res.render("profile", {
            userInfo: req.user,
        });
    } else {
        res.redirect("/user/login");
    }
});

export default router;
