import express from 'express';
import { apiRouter } from '../server/api.ts';

const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/', apiRouter);

export default app;