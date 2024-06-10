import express from "express";
import multer from "multer";
import booksStore from "../repo/booksStore.js";
const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();
router.use(express.urlencoded({ extended: true }));

router.get("/", (req, res) => {
    const books = booksStore.getBooks();

    res.render("index", {
        books,
        userInfo: req.user,
    });
});

router.get("/book/:id", ({ params: { id } }, res) => {
    const book = booksStore.getBook(id);

    if (!book) {
        res.status(404).render("error", { message: "404. Книга не найдена" });
    }

    res.render("view", {
        book,
        userInfo: req.user,
    });
});

router.get("/create", (req, res) => {
    res.render("create", {
        book: {},
        error: undefined,
        userInfo: req.user,
    });
});

router.get("/book/:id/update", ({ params: { id } }, res) => {
    const book = booksStore.getBook(id);

    if (!book) {
        res.status(404).render("error", { message: "404. Книга не найдена" });
    }

    res.render("update", {
        book,
        error: undefined,
        userInfo: req.user,
    });
});

const getSaveDataValidator = (type) => {
    return ({ body, file }, res, next) => {
        console.log("validate");

        const { title, authors } = body;

        let error = undefined;
        if (!title) {
            error = "Название не указано";
        } else if (!authors) {
            error = "Автор не указан";
        } else if (!file) {
            error = "Не приложен файл";
        }

        if (error) {
            return res.render(type, { book: body, error });
        } else {
            next();
        }
    };
};

router.post(
    "/book/create",
    upload.single("file"),
    getSaveDataValidator("create"),
    ({ body, file }, res) => {
        const book = booksStore.addBook({
            ...body,
            bookFile: {
                mimeType: file.mimetype,
                fileName: file.originalname,
                data: file.buffer,
            },
        });

        res.redirect(`/books/book/${book.id}`);
    }
);

router.post(
    "/book/update",
    upload.single("file"),
    getSaveDataValidator("update"),
    ({ body, file }, res) => {
        const updated = booksStore.updateBook({
            ...body,
            bookFile: {
                mimeType: file.mimetype,
                fileName: file.originalname,
                data: file.buffer,
            },
        });

        if (updated) {
            res.redirect(`/books/book/${updated.id}`);
        } else {
            res.status(404).render("error", {
                message: "404. Книга не найдена",
            });
        }
    }
);

router.get("/book/:id/download", (req, res) => {
    const { id } = req.params;

    const bookFile = booksStore.getBookFile(id);

    if (!bookFile) {
        return res
            .status(404)
            .render("error", { message: "404. Книга не найдена" });
    }

    const { mimeType, data, fileName } = bookFile;

    res.writeHead(200, {
        "Content-Type": mimeType,
        "Content-Disposition": "attachment;filename=" + fileName,
        "Content-Length": data.length,
    });
    res.end(Buffer.from(data, "binary"));
});

export default router;
