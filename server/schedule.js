import schedule from 'node-schedule';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import logger from './logger';
import attendanceService from './app/services/attendance.service';
import qrCodeService from './app/services/qrCode.service';

dayjs.extend(utc)
class Schedule {
    cronJobForAttendance() {
        //Execute a cron job every 10 Minutes
        schedule.scheduleJob('*/10 * * * *', async () => {
            try {
                const attendanceList = await attendanceService.findAll({
                    where: {
                        inTime: { $not: null },
                        outTime: { $is: null },
                    },
                })
                let count = 0;
                if (attendanceList && attendanceList.length > 0) {
                    attendanceList.forEach(async (attendance) => {
                        const endShift = dayjs(`${attendance.attendanceDate} ${attendance.shiftData.endTime}`, 'YYYY-MM-DD HH:mm:ss').toDate();
                        if (dayjs().subtract(15, 'minute').toDate() >= endShift) {
                            const body = {
                                attendanceDate: dayjs().toDate(),
                                outTime: dayjs(attendance.shiftData.endTime, 'HH:mm:ss').toDate(),
                                shiftId: attendance.shiftId,
                            }
                            await attendanceService.logoutAttendance(body, attendance);
                            count++;
                        }
                    })
                }

                logger.info(`Logout Attendance: ${count} attendees`);
            } catch (error) {
                logger.error(error);
            }
        });
    }

    deleteAllQRCodes() {
        schedule.scheduleJob('0 0 * * *', async () => {
            try {
                await qrCodeService.deleteAllQRCodes();
                logger.info("Delete all QR Codes during the day");
            } catch (error) {
                logger.error(error);
            }
        });
    }
}

module.exports = new Schedule;