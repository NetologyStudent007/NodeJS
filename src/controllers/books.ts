import express, { RequestHandler } from "express";
import multer from "multer";
import ah from "express-async-handler";
import { BooksRepository } from "../repo/booksRepository.js";
import { container } from "../iocContainer.js";
const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();
router.use(express.urlencoded({ extended: true }));

router.get(
    "/",
    ah(async (_req, res) => {
        const repo = container.get(BooksRepository);

        const books = await repo.getBooksAsync();
        res.render("index", {
            books,
        });
    })
);

router.get(
    "/book/:id",
    ah(async ({ params: { id } }, res) => {
        const repo = container.get(BooksRepository);

        const book = await repo.getBookAsync(id);

        if (!book) {
            return res
                .status(404)
                .render("error", { message: "404. Книга не найдена" });
        }

        res.render("view", {
            book,
        });
    })
);

router.get("/create", (_req, res) => {
    res.render("create", {
        book: {},
        error: undefined,
    });
});

router.get(
    "/book/:id/update",
    ah(async ({ params: { id } }, res) => {
        const repo = container.get(BooksRepository);

        const book = await repo.getBookAsync(id);

        if (!book) {
            res.status(404).render("error", {
                message: "404. Книга не найдена",
            });
        }

        res.render("update", {
            book,
            error: undefined,
        });
    })
);

const getSaveDataValidator = (type: "create" | "update"): RequestHandler => {
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
    ah(async ({ body, file }, res, next) => {
        if (!file) return next();

        const repo = container.get(BooksRepository);

        const book = await repo.addBookAsync({
            ...body,
            bookFile: {
                mimeType: file.mimetype,
                fileName: file.originalname,
                data: file.buffer,
            },
        });
        res.redirect(`/books/book/${book._id}`);
    })
);

router.post(
    "/book/update",
    upload.single("file"),
    getSaveDataValidator("update"),
    ah(async ({ body, file }, res, next) => {
        if (!file) return next();

        const repo = container.get(BooksRepository);

        const isUpdated = await repo.updateBookAsync({
            ...body,
            bookFile: {
                mimeType: file.mimetype,
                fileName: file.originalname,
                data: file.buffer,
            },
        });

        if (isUpdated) {
            res.redirect(`/books/book/${body.id}`);
        } else {
            res.status(404).render("error", {
                message: "404. Книга не найдена",
            });
        }
    })
);

router.get(
    "/book/:id/download",
    ah(async (req, res) => {
        const { id } = req.params;

        const repo = container.get(BooksRepository);

        const bookFile = await repo.getBookFileAsync(id);

        if (!bookFile) {
            return res
                .status(404)
                .render("error", { message: "404. Книга не найдена" });
        }

        const { mimeType, data, fileName } = bookFile;
        const buffer = Buffer.from(data, "base64");

        res.writeHead(200, {
            "Content-Type": mimeType,
            "Content-Disposition": "attachment;filename=" + fileName,
            "Content-Length": buffer.length,
        });
        res.end(buffer);
    })
);

router.get(
    "/book/:id/delete",
    ah(async (req, res) => {
        const { id } = req.params;

        const repo = container.get(BooksRepository);

        const deleted = await repo.deleteBookAsync(id);

        if (!deleted) {
            return res
                .status(404)
                .render("error", { message: "404. Книга не найдена" });
        }
        res.redirect("/books");
    })
);

export default router;
