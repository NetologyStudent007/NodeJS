import express from 'express'
import config from './config.js';
import books from './controllers/books.js';

const app = express();
app.set("view engine", "ejs");

app.use('/books', books);

app.use((req, res) => {
    res.status(404).render('error', { message: '404. Страница не найдена'});
})

app.listen(config.PORT);