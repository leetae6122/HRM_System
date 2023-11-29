import fileService from '../services/file.service';
import attendanceService from '../services/attendance.service';
import employeeService from '../services/employee.service';
import dayjs from 'dayjs';

exports.excelFileAttendanceStatisticsDate = async (req, res, next) => {
    try {
        const data = await attendanceService.findAll({ where: { attendanceDate: req.body.date } });
        const { buffer, fileName } = await fileService.excelFileAttendanceStatisticsDate(req.body.date, data);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=${fileName}.xlsx`);
        res.end(buffer, 'binary');
    } catch (error) {
        return next(error);
    }
}

exports.excelFileAttendanceStatisticsEmployee = async (req, res, next) => {
    try {
        const { employeeId, month } = req.body;
        const startDate = dayjs(month).startOf('month').toDate();
        const endDate = dayjs(month).endOf('month').toDate();
        const employee = await employeeService.foundEmployee(employeeId)

        const data = await attendanceService.findAll({
            where: {
                employeeId,
                attendanceDate: { $between: [startDate, endDate] }
            }
        });

        const { buffer, fileName } = await fileService.excelFileAttendanceStatisticsEmployee(
            startDate, endDate, employee, data
        );
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=${fileName}.xlsx`);
        res.end(buffer, 'binary');
    } catch (error) {
        return next(error);
    }
}

exports.excelFileEmployeeMonthStatistics = async (req, res, next) => {
    try {
        const data = await employeeService.findAll();
        const { buffer, fileName } = await fileService.excelFileEmployeeMonthStatistics(
            req.body.month, data
        );
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=${fileName}.xlsx`);
        res.end(buffer, 'binary');
    } catch (error) {
        return next(error);
    }
}