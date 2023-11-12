import dayjs from 'dayjs';
import ExcelJS from 'exceljs';
import { getMonthName } from '../utils/handleDate';
import * as fs from 'fs';

class FileService {
    async excelFileAttendanceStatisticsDate(date, data) {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet(dayjs(date).format('DD-MM-YYYY').xlsx);
        const font = { size: 13, bold: true }
        const alignment = { vertical: 'middle', horizontal: 'center' };
        const border = {
            top: { style: 'thick', color: { argb: '1E8449' } },
            left: { style: 'thick', color: { argb: '1E8449' } },
            bottom: { style: 'thick', color: { argb: '1E8449' } },
            right: { style: 'thick', color: { argb: '1E8449' } }
        }
        // Định dạng tiêu đề các cột
        worksheet.getCell('A1').value = 'Attendance Statistics Date:';
        worksheet.getCell('A1').font = font;
        worksheet.getCell('B1').value = dayjs(date).format('DD/MM/YYYY');

        const headerCells = ['A2', 'B2', 'C2', 'D2', 'E2', 'F2', 'G2', 'H2', 'I2', 'J2'];
        headerCells.forEach((cell) => {
            worksheet.getCell(cell).font = font;
            worksheet.getCell(cell).border = border;
            worksheet.getCell(cell).alignment = alignment;
        });
        worksheet.getCell('A2').value = 'Shift';
        worksheet.getCell('B2').value = 'Shift Type';
        worksheet.getCell('C2').value = 'Employee Id';
        worksheet.getCell('D2').value = 'Employee Name';
        worksheet.getCell('E2').value = 'In Time';
        worksheet.getCell('F2').value = 'Out Time';
        worksheet.getCell('G2').value = 'Status';
        worksheet.getCell('H2').value = 'Total Hours';
        worksheet.getCell('I2').value = 'Manager Status';
        worksheet.getCell('J2').value = 'Admin Status';

        data.forEach((row, index) => {
            worksheet.getCell(`A${index + 3}`).value = `${row.shiftData.name} (${row.shiftData.startTime} - ${row.shiftData.endTime})`;
            worksheet.getCell(`B${index + 3}`).value = row.shiftData.overtimeShift ? 'Overtime Shift' : 'Main Shift';
            worksheet.getCell(`C${index + 3}`).value = row.employeeData.id;
            worksheet.getCell(`D${index + 3}`).value = `${row.employeeData.firstName} ${row.employeeData.lastName}`;
            worksheet.getCell(`E${index + 3}`).value = row.inTime;
            worksheet.getCell(`F${index + 3}`).value = row.outTime;
            worksheet.getCell(`G${index + 3}`).value = `${row.inStatus}/${row.outStatus ? row.outStatus : ''}`;
            worksheet.getCell(`H${index + 3}`).value = `${row.totalHours ? row.totalHours : 0} hrs`;
            worksheet.getCell(`I${index + 3}`).value = row.managerStatus;
            worksheet.getCell(`J${index + 3}`).value = row.adminStatus;
        });

        // AutoFit column width
        worksheet.columns.forEach(column => {
            let maxColumnLength = 0;
            column.eachCell({ includeEmpty: true }, cell => {
                const columnLength = cell.value ? cell.value.toString().length : 10;
                if (columnLength > maxColumnLength) {
                    maxColumnLength = columnLength;
                }
            });
            column.width = maxColumnLength < 10 ? 10 : maxColumnLength + 5;
        });
        const buffer = await workbook.xlsx.writeBuffer();
        return { buffer, fileName: `AttendanceStatisticsDate_${dayjs(date).format('DD-MM-YYYY')}.xlsx` };
    }

    async excelFileAttendanceStatisticsEmployee(startDate, endDate, employee, data) {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet(employee.id);
        const font = { size: 13, bold: true };
        const alignment = { vertical: 'middle', horizontal: 'center' };
        const border = {
            top: { style: 'thick', color: { argb: '1E8449' } },
            left: { style: 'thick', color: { argb: '1E8449' } },
            bottom: { style: 'thick', color: { argb: '1E8449' } },
            right: { style: 'thick', color: { argb: '1E8449' } }
        }

        let hoursWorked = 0;
        let hoursOvertime = 0;

        data.forEach((attendance) => {
            if (attendance.shiftData.overtimeShift) {
                hoursOvertime += attendance.totalHours;
                return;
            }
            if (!attendance.shiftData.overtimeShift) {
                hoursWorked += attendance.totalHours;
            }
        });

        worksheet.getCell('A1').value = 'Attendance Statistics Month:';
        worksheet.getCell('A1').font = font;
        worksheet.getCell('B1').value = getMonthName(startDate);
        worksheet.getCell('C1').value = `${dayjs(startDate).format('DD/MM/YYYY')} -> ${dayjs(endDate).format('DD/MM/YYYY')}`;

        worksheet.getCell('A2').value = 'Employee ID:';
        worksheet.getCell('A2').font = font;
        worksheet.getCell('B2').value = employee.id;
        worksheet.getCell('C2').value = 'Employee Name:';
        worksheet.getCell('C2').font = font;
        worksheet.getCell('D2').value = `${employee.firstName} ${employee.lastName}`;

        worksheet.getCell('A3').value = 'Total hours worked:';
        worksheet.getCell('A3').font = font;
        worksheet.getCell('B3').value = `${(Math.round(hoursWorked * 100) / 100).toFixed(2)} hrs`;
        worksheet.getCell('C3').value = 'Total overtime:';
        worksheet.getCell('C3').font = font;
        worksheet.getCell('D3').value = `${(Math.round(hoursOvertime * 100) / 100).toFixed(2)} hrs`;

        const headerCells = ['A4', 'B4', 'C4', 'D4', 'E4', 'F4', 'G4', 'H4', 'I4'];
        headerCells.forEach((cell) => {
            worksheet.getCell(cell).font = font;
            worksheet.getCell(cell).border = border;
            worksheet.getCell(cell).alignment = alignment;
        });
        worksheet.getCell('A4').value = 'Attendance Date';
        worksheet.getCell('B4').value = 'Shift';
        worksheet.getCell('C4').value = 'Shift Type';
        worksheet.getCell('D4').value = 'In Time';
        worksheet.getCell('E4').value = 'Out Time';
        worksheet.getCell('F4').value = 'Status';
        worksheet.getCell('G4').value = 'Total Hours';
        worksheet.getCell('H4').value = 'Manager Status';
        worksheet.getCell('I4').value = 'Admin Status';

        data.forEach((row, index) => {
            worksheet.getCell(`A${index + 5}`).value = dayjs(row.attendanceDate).format('DD/MM/YYYY');
            worksheet.getCell(`B${index + 5}`).value = `${row.shiftData.name} (${row.shiftData.startTime} - ${row.shiftData.endTime})`;
            worksheet.getCell(`C${index + 5}`).value = row.shiftData.overtimeShift ? 'Overtime Shift' : 'Main Shift';
            worksheet.getCell(`D${index + 5}`).value = row.inTime;
            worksheet.getCell(`E${index + 5}`).value = row.outTime;
            worksheet.getCell(`F${index + 5}`).value = `${row.inStatus}/${row.outStatus ? row.outStatus : ''}`;
            worksheet.getCell(`G${index + 5}`).value = `${row.totalHours ? row.totalHours : 0} hrs`;
            worksheet.getCell(`H${index + 5}`).value = row.managerStatus;
            worksheet.getCell(`I${index + 5}`).value = row.adminStatus;
        });

        worksheet.columns.forEach(column => {
            let maxColumnLength = 0;
            column.eachCell({ includeEmpty: true }, cell => {
                const columnLength = cell.value ? cell.value.toString().length : 10;
                if (columnLength > maxColumnLength) {
                    maxColumnLength = columnLength;
                }
            });
            column.width = maxColumnLength < 10 ? 10 : maxColumnLength + 5;
        });
        const buffer = await workbook.xlsx.writeBuffer();
        return { buffer, fileName: `AttendanceStatistics_EmployeeId-${employee.id}.xlsx` };
    }

    deleteFile(path) {
        fs.unlink(
            path,
            (err) => err,
        )
    }
}

module.exports = new FileService;