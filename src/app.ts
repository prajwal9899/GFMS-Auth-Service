import 'reflect-metadata';
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import logger from './config/logger';
import { HttpError } from 'http-errors';
import authRouter from './routes/auth';
import userRouter from './routes/user';
import { globalErrorHandler } from './middlewares/globalErrorHandler';

const app = express();

app.use(
  cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true,
  }),
);

app.use(express.static('public'));
app.use(cookieParser());
app.use(express.json());

app.get('/', async (req, res, next) => {
  res.json({ Status: 'Server Running' });
});

app.use('/auth', authRouter);
app.use('/users', userRouter);

//? Global error Hhandler
app.use(globalErrorHandler);

export default app;
