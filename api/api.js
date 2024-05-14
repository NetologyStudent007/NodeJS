import express from 'express';
import books from './controllers/books.js';
import user from './controllers/user.js';

const router = express.Router();
router.use('/books', books);
router.use('/user', user);

export default router;