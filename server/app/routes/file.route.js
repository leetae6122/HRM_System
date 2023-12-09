import express from "express";
import fileController from "./../controllers/file.controller.js";
import validation from '../middlewares/validation.middleware.js';
import {
    createExcelFileAttendanceStatisticsDate,
    createExcelFileAttendanceStatisticsEmployee,
    createExcelFileEmployeeMonthStatistics
} from "../validations/file.validation.js";

const router = express.Router();

router.route("/excel/date")
    .post(validation(createExcelFileAttendanceStatisticsDate), fileController.excelFileAttendanceStatisticsDate)
router.route("/excel/employee")
    .post(validation(createExcelFileAttendanceStatisticsEmployee), fileController.excelFileAttendanceStatisticsEmployee)
router.route("/excel/month-statistics")
    .post(validation(createExcelFileEmployeeMonthStatistics), fileController.excelFileEmployeeMonthStatistics)

module.exports = router;