import express from "express";
import fileController from "./../controllers/file.controller";
import validation from '../middlewares/validation.middleware';
import {
    createExcelFileAttendanceStatisticsDate,
    createExcelFileAttendanceStatisticsEmployee
} from "../validations/file.validation";

const router = express.Router();

router.route("/excel/date")
    .post(validation(createExcelFileAttendanceStatisticsDate), fileController.excelFileAttendanceStatisticsDate)
router.route("/excel/employee")
    .post(validation(createExcelFileAttendanceStatisticsEmployee), fileController.excelFileAttendanceStatisticsEmployee)

module.exports = router;