import express from 'express';
import multer from 'multer';
import BooksStore from '../repo/booksStore.js';
const upload = multer({ storage: multer.memoryStorage() })

const router = express.Router();

const booksStore = new BooksStore();

const putPostDataValidator = ({ body: { title, authors }, file }, res, next) => {

    let error = undefined;
    if (!title) {
        error = 'Название не указано';
    } else if (!authors) {
        error = 'Автор не указан';
    } else if (!file) {
        error = 'Не приложен файл';
    }

    if (error) {
        return res.status(400).json({ error });
    } else {
        next();
    }

}

router.get('/', (req, res) => {
    res.json(booksStore.getBooks());
})

router.get('/:id', (req, res) => {
    const { id } = req.params;

    const book = booksStore.getBook(id);

    if (book) {
        res.json(book)
    } else {
        res.status(404).json({ error: 'Книга не найдена' });
    }
})

router.post('/',
    upload.single('file'),
    putPostDataValidator,
    ({ body, file }, res) => {

        const newBook = booksStore.addBook({
            ...body,
            bookFile: {
                mimeType: file.mimetype,
                fileName: file.originalname,
                data: file.buffer
            }
        });

        res.status(201).json(newBook);
    })

router.put('/:id',
    upload.single('file'),
    putPostDataValidator,
    ({ body, file, params: { id } }, res) => {

        const updated = booksStore.updateBook({
            id,
            ...body,
            bookFile: {
                mimeType: file.mimetype,
                fileName: file.originalname,
                data: file.buffer
            }
        });

        if (updated) {
            res.json(updated);
        } else {
            res.status(404).json({ error: 'Книга не найдена' });
        }
    })

router.delete('/:id', (req, res) => {
    const { id } = req.params;

    const deleted = booksStore.deleteBook(id);

    if (deleted) {
        res.end();
    } else {
        res.status(404).json({ error: 'Книга не найдена' });
    }
})

router.get('/:id/download', (req, res) => {
    const { id } = req.params;

    const bookFile = booksStore.getBookFile(id);

    if (!bookFile) {
        return res.status(404).json({ error: 'Книга не найдена' });
    }

    const { mimeType, data, fileName } = bookFile;

    res.writeHead(200, {
        'Content-Type': mimeType,
        'Content-Disposition': 'attachment;filename=' + fileName,
        'Content-Length': data.length
    });
    res.end(Buffer.from(data, 'binary'));
})

export default router;