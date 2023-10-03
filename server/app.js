require('dotenv').config();
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import createError from 'http-errors';
import { verifyAccessToken, verifyAdmin } from './app/middlewares/auth.middleware';

import authRouter from "./app/routes/auth.route";
import userRouter from "./app/routes/user.route";
import employeeRouter from "./app/routes/employee.route";
import positionRouter from "./app/routes/position.route";
import currencyRouter from "./app/routes/currency.route";
import salaryRouter from "./app/routes/salary.route";

const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.get("/", (req, res) => {
    res.json({ message: "Welcome to human resource management system." });
});

app.use("/api/auth", authRouter);
app.use("/api/user", verifyAccessToken, userRouter);
app.use("/api/employee", verifyAccessToken, verifyAdmin, employeeRouter);
app.use("/api/position", verifyAccessToken, verifyAdmin, positionRouter);
app.use("/api/currency", verifyAccessToken, verifyAdmin, currencyRouter);
app.use("/api/salary", verifyAccessToken, verifyAdmin, salaryRouter);

// handle 404 response 
app.use((req, res, next) => {
    return next(createError.NotFound(`Can't find ${req.originalUrl} on the server!`))
});

//define error-handling middleware last, after other app.use() and routes calls 
// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
    return res.status(error.statusCode || 500).json({
        status: error.status || "error",
        message: error.message || "Internal Server Error",
    });
});

module.exports = app;