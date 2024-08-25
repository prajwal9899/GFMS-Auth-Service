import 'reflect-metadata';
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import { Config } from './config/index';
import cookieParser from 'cookie-parser';
import logger from './config/logger';
import { HttpError } from 'http-errors';
import authRouter from './routes/auth';
import userRouter from './routes/user';
import { globalErrorHandler } from './middlewares/globalErrorHandler';

const app = express();
const ADMINDASHBOARD_URL = Config.ADMINDASHBOARD_URL;
app.use(
  cors({
    origin: ['https://gfms-admin-dashboard-6sg4m2gpg-prajwal9899s-projects.vercel.app','https://gfms-admin-dashboard.vercel.app'],
    credentials: true,
  }),
);

app.use(express.static('public'));
app.use(cookieParser());
app.use(express.json());

app.get('/', async (req, res, next) => {
  res.json({});
});

app.use('/auth', authRouter);
app.use('/users', userRouter);

//? Global error Hhandler
app.use(globalErrorHandler);

export default app;
