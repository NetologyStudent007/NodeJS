import express from 'express'
import api from './api/api.js';
import config from './config.js';

const app = express();
app.use(express.json());
app.use('/api', api);

/* Не нашел как подключить кастомную мидлварю для обработки ошибок что бы роутер не валили ошибки в html.
Примеры на оффсайте express не актуальные видимо. Код ниже невалидный роут не перехватывает.

Может быть в следующей теме это будет. Хотелось бы этот момент прояснить

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
  })
*/

app.listen(config.PORT);