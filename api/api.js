import express from 'express';
import books from './controllers/books.js';
import user from './controllers/user.js';

const router = express.Router();
router.use(express.json());

router.use('/books', books);
router.use('/user', user);

router.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
})

router.use((error, req, res, next) => {
    res.status(error.status ?? 500).json({ error: error.message })
})

export default router;