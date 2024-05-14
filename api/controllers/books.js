import express from 'express';
import BooksStore from '../repo/booksStore.js';

const router = express.Router();

const booksStore = new BooksStore();

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

router.post('/', (req, res) => {

    const newBook = booksStore.addBook(req.body);
    res.status(201).json(newBook);
})

router.put('/:id', (req, res) => {
    const { id } = req.params;

    const updated = booksStore.updateBook({
        id,
        ...req.body
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

export default router;