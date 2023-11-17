import schedule from 'node-schedule';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import logger from './logger';
import attendanceService from './app/services/attendance.service';
import qrCodeService from './app/services/qrCode.service';
import _ from 'lodash';

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
                let handleList = [];
                if (attendanceList && attendanceList.length > 0) {
                    handleList = await Promise.all(attendanceList.map(async (attendance) => {
                        const endShift = dayjs(`${attendance.attendanceDate} ${attendance.shiftData.endTime}`, 'YYYY-MM-DD HH:mm:ss').toDate();
                        if (dayjs().subtract(10, 'minute').toDate() < endShift) {
                            return;
                        }
                        const body = {
                            attendanceDate: dayjs().toDate(),
                            outTime: dayjs(attendance.shiftData.endTime, 'HH:mm:ss').toDate(),
                            shiftId: attendance.shiftId,
                        }
                        await attendanceService.logoutAttendance(body, attendance);
                        return attendance;
                    }))
                }
                const list = _.compact(handleList);
                logger.info(`Logout Attendance: ${list.length} attendees`);
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