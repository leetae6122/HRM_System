import schedule from 'node-schedule';
import dayjs from 'dayjs';
import logger from './logger.js';
import attendanceService from './app/services/attendance.service.js';
import qrCodeService from './app/services/qrCode.service.js';
import _ from 'lodash';

class Schedule {
    cronJobForAttendance() {
        //Execute a cron job every 10 Minutes
        schedule.scheduleJob('*/2 * * * *', async () => {
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
                        const payload = {
                            outTime: dayjs(attendance.shiftData.endTime, 'HH:mm:ss').toDate(),
                        }
                        await attendanceService.logoutAttendance(payload, attendance);
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
        schedule.scheduleJob('0 */1 * * *', async () => {
            try {
                const qrCodeList = await qrCodeService.findAll({
                    expiredAt: {$lte: dayjs().toDate()}
                });
                const idList = qrCodeList.map((qrCode) => qrCode.id);
                await qrCodeService.deleteQRCode(idList);
                logger.info(`Total number of QR Codes deleted: ${qrCodeList.length}`);
            } catch (error) {
                logger.error(error);
            }
        });
    }
}

module.exports = new Schedule;