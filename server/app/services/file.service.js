import dayjs from 'dayjs';
import ExcelJS from 'exceljs';
import _ from 'lodash';
import { getMonthName } from '../utils/handleDate';
import attendanceService from '../services/attendance.service';
import leaveService from '../services/leave.service';
import allowanceService from '../services/allowance.service';
import rewardPunishmentService from '../services/rewardPunishment.service';

import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat)
class FileService {
    async excelFileAttendanceStatisticsDate(date, data) {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet(dayjs(date).format('DD-MM-YYYY'));
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
        worksheet.getCell('H2').value = 'Total Hours (hrs)';
        worksheet.getCell('I2').value = 'Manager Status';
        worksheet.getCell('J2').value = 'Admin Status';

        data.forEach((row, index) => {
            worksheet.getCell(`A${index + 3}`).value = `${row.shiftData.name} (${row.shiftData.startTime} - ${row.shiftData.endTime})`;
            worksheet.getCell(`B${index + 3}`).value = row.shiftData.overtimeShift ? 'Overtime Shift' : 'Main Shift';
            worksheet.getCell(`B${index + 3}`).font = {
                color: {
                    argb: row.shiftData.overtimeShift ? 'F39C12' : '229954'
                },
            }

            worksheet.getCell(`C${index + 3}`).value = row.employeeData.id;
            worksheet.getCell(`D${index + 3}`).value = `${row.employeeData.firstName} ${row.employeeData.lastName}`;
            worksheet.getCell(`E${index + 3}`).value = row.inTime;
            worksheet.getCell(`E${index + 3}`).font = {
                color: { argb: row.inStatus === 'On Time' ? '229954' : 'C0392B' },
            }
            worksheet.getCell(`F${index + 3}`).value = row.outTime;
            worksheet.getCell(`F${index + 3}`).font = {
                color: { argb: row.outStatus === 'On Time' ? '229954' : 'C0392B' },
            }
            worksheet.getCell(`G${index + 3}`).value = `${row.inStatus}/${row.outStatus ? row.outStatus : ''}`;
            worksheet.getCell(`H${index + 3}`).value = row.totalHours ? row.totalHours : 0;
            worksheet.getCell(`I${index + 3}`).value = row.managerStatus;
            worksheet.getCell(`I${index + 3}`).font = {
                color: {
                    argb: row.managerStatus === 'Pending' ? 'F39C12' :
                        row.managerStatus === 'Reject' ? 'C0392B' : '229954'
                },
            }
            worksheet.getCell(`J${index + 3}`).value = row.adminStatus;
            worksheet.getCell(`J${index + 3}`).font = {
                color: {
                    argb: row.adminStatus === 'Pending' ? 'F39C12' :
                        row.adminStatus === 'Reject' ? 'C0392B' : '229954'
                },
            }
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
            column.width = maxColumnLength < 10 ? 10 : maxColumnLength + 3;
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

        worksheet.getCell('A1').value = 'Statistics Month:';
        worksheet.getCell('A1').font = font;
        worksheet.getCell('B1').value = getMonthName(startDate);
        worksheet.getCell('C1').value = `${dayjs(startDate).format('DD/MM/YYYY')} -> ${dayjs(endDate).format('DD/MM/YYYY')}`;

        worksheet.getCell('A2').value = 'Employee ID:';
        worksheet.getCell('A2').font = font;
        worksheet.getCell('B2').value = employee.id;
        worksheet.getCell('C2').value = 'Employee Name:';
        worksheet.getCell('C2').font = font;
        worksheet.getCell('D2').value = `${employee.lastName} ${employee.firstName}`;

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
        worksheet.getCell('G4').value = 'Total Hours (hrs)';
        worksheet.getCell('H4').value = 'Manager Status';
        worksheet.getCell('I4').value = 'Admin Status';

        data.forEach((row, index) => {
            worksheet.getCell(`A${index + 5}`).value = dayjs(row.attendanceDate).format('DD/MM/YYYY');
            worksheet.getCell(`B${index + 5}`).value = `${row.shiftData.name} (${row.shiftData.startTime} - ${row.shiftData.endTime})`;
            worksheet.getCell(`C${index + 5}`).value = row.shiftData.overtimeShift ? 'Overtime Shift' : 'Main Shift';
            worksheet.getCell(`C${index + 5}`).font = {
                color: {
                    argb: row.shiftData.overtimeShift ? 'F39C12' : '229954'
                },
            }

            worksheet.getCell(`D${index + 5}`).value = row.inTime;
            worksheet.getCell(`D${index + 5}`).font = {
                color: { argb: row.inStatus === 'On Time' ? '229954' : 'C0392B' },
            }
            worksheet.getCell(`E${index + 5}`).value = row.outTime;
            worksheet.getCell(`E${index + 5}`).font = {
                color: { argb: row.outStatus === 'On Time' ? '229954' : 'C0392B' },
            }
            worksheet.getCell(`F${index + 5}`).value = `${row.inStatus}/${row.outStatus ? row.outStatus : ''}`;
            worksheet.getCell(`G${index + 5}`).value = row.totalHours ? row.totalHours : 0;
            worksheet.getCell(`H${index + 5}`).value = row.managerStatus;
            worksheet.getCell(`H${index + 5}`).font = {
                color: {
                    argb: row.managerStatus === 'Pending' ? 'F39C12' :
                        row.managerStatus === 'Reject' ? 'C0392B' : '229954'
                },
            }
            worksheet.getCell(`I${index + 5}`).value = row.adminStatus;
            worksheet.getCell(`I${index + 5}`).font = {
                color: {
                    argb: row.adminStatus === 'Pending' ? 'F39C12' :
                        row.adminStatus === 'Reject' ? 'C0392B' : '229954'
                },
            }
        });

        worksheet.columns.forEach(column => {
            let maxColumnLength = 0;
            column.eachCell({ includeEmpty: true }, cell => {
                const columnLength = cell.value ? cell.value.toString().length : 10;
                if (columnLength > maxColumnLength) {
                    maxColumnLength = columnLength;
                }
            });
            column.width = maxColumnLength < 10 ? 10 : maxColumnLength + 3;
        });
        const buffer = await workbook.xlsx.writeBuffer();
        return { buffer, fileName: `AttendanceStatistics_EmployeeId-${employee.id}.xlsx` };
    }

    async excelFileEmployeeMonthStatistics(month, data) {
        const startDate = dayjs(month).startOf('month').toDate();
        const endDate = dayjs(month).endOf('month').toDate();
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet(dayjs(month).format('MM-YYYY'));
        const font = { size: 13, bold: true };
        const alignment = { vertical: 'middle', horizontal: 'center' };
        const border = {
            top: { style: 'thick', color: { argb: '1E8449' } },
            left: { style: 'thick', color: { argb: '1E8449' } },
            bottom: { style: 'thick', color: { argb: '1E8449' } },
            right: { style: 'thick', color: { argb: '1E8449' } }
        }


        worksheet.getCell('A1').value = 'Attendance Statistics Month:';
        worksheet.getCell('A1').font = font;
        worksheet.getCell('B1').value = getMonthName(month);
        worksheet.getCell('C1').value = `${dayjs(startDate).format('DD/MM/YYYY')} -> ${dayjs(endDate).format('DD/MM/YYYY')}`;

        const headerCells = ['A2', 'B2', 'C2', 'D2', 'E2', 'F2', 'G2', 'H2', 'I2', 'J2'];
        headerCells.forEach((cell) => {
            worksheet.getCell(cell).font = font;
            worksheet.getCell(cell).border = border;
            worksheet.getCell(cell).alignment = alignment;
        });
        worksheet.getCell('A2').value = 'Employee Id';
        worksheet.getCell('B2').value = 'Employee Name';
        worksheet.getCell('C2').value = 'Total Working Hours (hrs)';
        worksheet.getCell('D2').value = 'Total Overtime Hours (hrs)';
        worksheet.getCell('E2').value = 'Total Main Shift (shifts)';
        worksheet.getCell('F2').value = 'Total Overtime Shift (shifts)';
        worksheet.getCell('G2').value = 'Days Of Leave';
        worksheet.getCell('H2').value = 'Allowances';
        worksheet.getCell('I2').value = 'Rewards';
        worksheet.getCell('J2').value = 'Punishments';

        await Promise.all(data.map(async (row, index) => {
            let totalWorkingHours = 0;
            let totalOvertimeHours = 0;
            let totalMainShift = 0;
            let totalOvertimeShift = 0;
            const attendances = await attendanceService.findAll({
                where: {
                    employeeId: row.id,
                    attendanceDate: { $between: [startDate, endDate] },
                    managerStatus: 'Approved',
                    adminStatus: 'Approved'
                }
            });

            attendances.forEach((attendance) => {
                if (attendance.shiftData.overtimeShift) {
                    totalOvertimeHours += attendance.totalHours;
                    totalOvertimeShift += 1;
                    return;
                }
                if (!attendance.shiftData.overtimeShift) {
                    totalWorkingHours += attendance.totalHours;
                    totalMainShift += 1;
                }
            });

            const leaves = await leaveService.findAll({
                where: {
                    employeeId: row.id,
                    $or: [
                        { leaveFrom: { $between: [startDate, endDate] } },
                        { leaveTo: { $between: [startDate, endDate] } }
                    ],
                    status: 'Approved'
                }
            });
            const daysLeaves = leaves.map((leave) =>
                `#${leave.id} - ${leave.title} (${dayjs(leave.leaveFrom).format('DD/MM/YYYY')} - ${dayjs(leave.leaveTo).format('DD/MM/YYYY')})`
            )
                .toString()
                .replace(/,+/g, '\r\n');

            const allowancesList = await allowanceService.findAll({
                where: {
                    employeeId: row.id,
                    startDate: { $lte: startDate },
                    endDate: { $gte: endDate }
                }
            });
            const allowances = allowancesList.map((allowance) =>
                `#${allowance.id} - ${allowance.title} (${dayjs(allowance.startDate).format('MM/YYYY')} - ${dayjs(allowance.endDate).format('MM/YYYY')}): +${this.formatNumberCustom(allowance.amount)} VNĐ`
            )
                .toString()
                .replace(/,+/g, '\r\n');

            const rewardPunishmentList = await rewardPunishmentService.findAll({
                where: {
                    employeeId: row.id,
                    date: { $between: [startDate, endDate] }
                }
            });

            const rewards = _.compact(rewardPunishmentList.map((rewardPunishment) =>
                rewardPunishment.type === 'Reward' ? `#${rewardPunishment.id} - ${rewardPunishment.reason} (${dayjs(rewardPunishment.date).format('DD/MM/YYYY')}): +${this.formatNumberCustom(rewardPunishment.amount)} VNĐ` : null
            ))
                .toString()
                .replace(/,+/g, '\r\n');


            const punishments = _.compact(rewardPunishmentList.map((rewardPunishment) =>
                rewardPunishment.type === 'Punishment' ? `#${rewardPunishment.id} - ${rewardPunishment.reason} (${dayjs(rewardPunishment.date).format('DD/MM/YYYY')}): -${this.formatNumberCustom(rewardPunishment.amount)} VNĐ` : null
            ))
                .toString()
                .replace(/,+/g, '\r\n');

            worksheet.getCell(`A${index + 3}`).value = row.id;
            worksheet.getCell(`B${index + 3}`).value = `${row.lastName} ${row.firstName}`;
            worksheet.getCell(`C${index + 3}`).value = totalWorkingHours;
            worksheet.getCell(`D${index + 3}`).value = totalOvertimeHours;
            worksheet.getCell(`E${index + 3}`).value = totalMainShift;
            worksheet.getCell(`F${index + 3}`).value = totalOvertimeShift;
            worksheet.getCell(`G${index + 3}`).value = daysLeaves;
            worksheet.getCell(`G${index + 3}`).alignment = { wrapText: true };

            worksheet.getCell(`H${index + 3}`).value = allowances;
            worksheet.getCell(`H${index + 3}`).alignment = { wrapText: true };

            worksheet.getCell(`I${index + 3}`).value = rewards;
            worksheet.getCell(`I${index + 3}`).alignment = { wrapText: true };

            worksheet.getCell(`J${index + 3}`).value = punishments;
            worksheet.getCell(`J${index + 3}`).alignment = { wrapText: true };
        }));

        // AutoFit column width
        worksheet.columns.forEach(column => {
            let maxColumnLength = 0;
            column.eachCell({ includeEmpty: true }, cell => {
                const columnLength = cell.value ? cell.value.toString().length : 10;
                if (columnLength > maxColumnLength) {
                    maxColumnLength = columnLength;
                }
            });
            column.width = maxColumnLength < 10 ? 10 : maxColumnLength < 60 ? maxColumnLength + 3 : 60;
        });
        const buffer = await workbook.xlsx.writeBuffer();
        return { buffer, fileName: `MonthStatistics_${dayjs(month).format('MM-YYYY')}.xlsx` };
    }

    formatNumberCustom(number) {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
}

module.exports = new FileService;