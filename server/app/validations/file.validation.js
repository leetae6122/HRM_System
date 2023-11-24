const Joi = require('joi');

const createExcelFileAttendanceStatisticsDate = Joi.object({
    date: Joi.date().required(),
});

const createExcelFileAttendanceStatisticsEmployee = Joi.object({
    employeeId: Joi.string().max(10).required(),
    month: Joi.date().required(),
});

const createExcelFileEmployeeMonthStatistics = Joi.object({
    month: Joi.date().required(),
});


module.exports = {
    createExcelFileAttendanceStatisticsDate,
    createExcelFileAttendanceStatisticsEmployee,
    createExcelFileEmployeeMonthStatistics
};