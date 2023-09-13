require('dotenv').config();
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import createError from 'http-errors';
import { verifyAccessToken } from './app/middlewares/auth.middleware'; 

const authRouter = require("./app/routes/auth.route");
const userRouter = require("./app/routes/user.route");
const employeeRouter = require("./app/routes/employee.route");
const positionRouter = require("./app/routes/position.route");
const currencyRouter = require("./app/routes/currency.route");

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
app.use("/api/employee", verifyAccessToken, employeeRouter);
app.use("/api/position", verifyAccessToken, positionRouter);
app.use("/api/currency", verifyAccessToken, currencyRouter);

// handle 404 response 
app.use((req, res, next) => {
    return next(createError.NotFound(`Can't find ${req.originalUrl} on the server!`))
});

//define error-handling middleware last, after other app.use() and routes calls 
app.use((error, req, res, next) => {
    return res.status(error.statusCode || 500).json({
        error: {
            status: error.status || "error",
            message: error.message || "Internal Server Error",
        }
    });
});

module.exports = app;