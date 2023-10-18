import schedule from 'node-schedule';
import projectServer from './app/services/project.service';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import logger from './logger';

dayjs.extend(utc)
class Schedule {
    runningProjects() {
        schedule.scheduleJob('0 1 * * *', async () => {
            try {
                const current = dayjs();
                const projectList = await projectServer.findAll({
                    where: {
                        startDate: {
                            $between: [
                                current.subtract(1, 'day').utc().format(),
                                current.add(1, 'day').utc().format()
                            ]
                        },
                        status: 'Upcoming'
                    }
                })
                projectList.forEach(async (project) => {
                    if (dayjs(project.startDate) <= current) {
                        await projectServer.updateProject(project.id, {
                            status: 'Running'
                        });
                    }
                })
                logger.info("Update Running Projects");
            } catch (error) {
                logger.error(error);
            }
        });
    }

    completeProjects() {
        schedule.scheduleJob('0 1 * * *', async () => {
            try {
                const current = dayjs();
                const projectList = await projectServer.findAll({
                    where: {
                        endDate: {
                            $between: [
                                current.subtract(1, 'day').utc().format(),
                                current.add(1, 'day').utc().format()
                            ]
                        },
                        status: 'Running'
                    }
                })
                projectList.forEach(async (project) => {
                    if (dayjs(project.endDate) <= current) {
                        await projectServer.updateProject(project.id, {
                            status: 'Complete'
                        });
                    }
                });
                logger.info("Update Complete Projects");
            } catch (error) {
                logger.error(error);
            }
        });
    }
}

module.exports = new Schedule;