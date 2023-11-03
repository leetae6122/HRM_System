require('dotenv').config();
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import createError from 'http-errors';
import { verifyAccessToken, verifyAdmin } from './app/middlewares/auth.middleware';
import Schedule from './schedule';

import authRouter from "./app/routes/auth.route";
import userRouter from "./app/routes/user.route";
import employeeRouter from "./app/routes/employee.route";
import positionRouter from "./app/routes/position.route";
import salaryRouter from "./app/routes/salary.route";
import departmentRouter from "./app/routes/department.route";
import leaveRouter from "./app/routes/leave.route";
import attendanceRouter from "./app/routes/attendance.route";
import shiftRouter from "./app/routes/shift.route";
import payrollRouter from "./app/routes/payroll.route";
import allowanceRouter from "./app/routes/allowance.route";
import rewardPunishmentRouter from "./app/routes/rewardPunishment.route";

const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.get("/", async (req, res) => {
    res.json({ message: "Welcome to human resource management system." });
});

app.use("/api/auth", authRouter);
app.use("/api/user", verifyAccessToken, userRouter);
app.use("/api/employee", verifyAccessToken, employeeRouter);
app.use("/api/leave", verifyAccessToken, leaveRouter);
app.use("/api/attendance", verifyAccessToken, attendanceRouter);
app.use("/api/shift", verifyAccessToken, shiftRouter);
app.use("/api/payroll", verifyAccessToken, payrollRouter);
app.use("/api/allowance", verifyAccessToken, allowanceRouter);
app.use("/api/reward-punishment", verifyAccessToken, rewardPunishmentRouter);

app.use("/api/position", verifyAccessToken, verifyAdmin, positionRouter);
app.use("/api/salary", verifyAccessToken, verifyAdmin, salaryRouter);
app.use("/api/department", verifyAccessToken, verifyAdmin, departmentRouter);

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

// Schedule.runningProjects();

module.exports = app;