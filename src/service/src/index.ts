import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { z } from 'zod';

import { errorMiddleware } from './middleware/error';

import historyRouter from './routes/history';
import categoriesRouter from './routes/categories';

const env = z.object({
    PORT: z.string().default('3434'),
    ALLOW_ORIGINS: z.string().default('http://localhost:5173'),
}).parse(process.env);

const app = express();
app.use(express.json());

const origins = env.ALLOW_ORIGINS.split(',').map(origin => origin.trim());
app.use(cors({
    origin: origins
}));

app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

app.use('/api/history', historyRouter);
app.use('/api/categories', categoriesRouter);

app.use(errorMiddleware);

app.listen(Number(env.PORT), () => {
    console.log(`Sunucu http://localhost:${env.PORT} adresinde çalışıyor`);
});