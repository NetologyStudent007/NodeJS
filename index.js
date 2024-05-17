import express from 'express'
import api from './api/api.js';
import config from './config.js';

const app = express();
app.use('/api', api);

app.listen(config.PORT);