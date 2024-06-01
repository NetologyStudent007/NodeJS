import express from "express";
import multer from "multer";
import config from "../config.js";
import booksStore from "../repo/booksStore.js";
const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();
router.use(express.urlencoded({ extended: true }));

router.get("/", (req, res) => {
    const books = booksStore.getBooks();

    res.render("index", {
        books,
    });
});

router.get("/book/:id", async ({ params: { id } }, res) => {
    const book = booksStore.getBook(id);

    if (!book) {
        return res
            .status(404)
            .render("error", { message: "404. Книга не найдена" });
    }

    let viewCount = -1;

    try {
        const viewCountInfo = await (
            await fetch(`${config.COUNTER_URL}/${id}/incr`, {
                method: "POST",
            })
        ).json();
        viewCount = viewCountInfo.counter;
    } catch {
        console.error(
            `Не удалось получить значение счетчика просмотров книги c id: ${id}`
        );
    }

    res.render("view", {
        book,
        viewCount,
    });
});

router.get("/create", (req, res) => {
    res.render("create", {
        book: {},
        error: undefined,
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
    });
});

const getSaveDataValidator = (type) => {
    return ({ body, file }, res, next) => {
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
