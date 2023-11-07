import schedule from 'node-schedule';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import logger from './logger';
import attendanceService from './app/services/attendance.service';

dayjs.extend(utc)
class Schedule {
    cronJobForAttendance() {
        //Execute a cron job every 15 Minutes
        schedule.scheduleJob('*/15 * * * *', async () => {
            try {
                const attendanceList = await attendanceService.findAll({
                    where: {
                        inTime: { $not: null },
                        outTime: { $is: null },
                    },
                    shiftFilter: {
                        where: {
                            endTime: { $lte: dayjs().subtract(30, 'minute').toDate() },
                        }
                    }
                })

                if (attendanceList && attendanceList.length > 0) {
                    attendanceList.forEach(async (attendance) => {
                        const body = {
                            attendanceDate: dayjs().toDate(),
                            outTime: dayjs(attendance.shiftData.endTime, 'HH:mm:ss').add(1, 'minute').toDate(),
                            shiftId: attendance.shiftId,
                        }
                        await attendanceService.logoutAttendance(body, attendance, attendance.shiftData);
                    })
                }

                logger.info(`Logout Attendance: ${attendanceList.length} attendees`);
            } catch (error) {
                logger.error(error);
            }
        });
    }

    runningProjects() {
        schedule.scheduleJob('1 0 * * *', async () => {
            // try {
            //     const current = dayjs();
            //     const projectList = await projectServer.findAll({
            //         where: {
            //             startDate: {
            //                 $between: [
            //                     current.subtract(1, 'day').utc().format(),
            //                     current.add(1, 'day').utc().format()
            //                 ]
            //             },
            //             status: 'Upcoming'
            //         }
            //     })
            //     projectList.forEach(async (project) => {
            //         if (dayjs(project.startDate) <= current) {
            //             await projectServer.updateProject(project.id, {
            //                 status: 'Running'
            //             });
            //         }
            //     })
            //     logger.info("Update Running Projects");
            // } catch (error) {
            //     logger.error(error);
            // }
        });
    }
}

module.exports = new Schedule;