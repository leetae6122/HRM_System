import sequelize from "sequelize";
import db from "./../models/index";
import dayjs from "dayjs";

class AttendanceService {
    async findById(id) {
        const result = await db.Attendance.findByPk(id, {
            include: [
                {
                    model: db.Employee, as: 'employeeData',
                    attributes: ['firstName', 'lastName', 'email']
                },
                {
                    model: db.Employee, as: 'handlerData',
                    attributes: ['firstName', 'lastName', 'email']
                },
                {
                    model: db.Task, as: 'taskData',
                    attributes: ['title']
                },
                {
                    model: db.Project, as: 'projectData',
                    attributes: ['title']
                },
            ],
            raw: true,
            nest: true
        });
        return result;
    }

    async findByAttendanceCode(code) {
        const result = await db.Attendance.findOne({
            where: { code },
            raw: true,
            nest: true
        });
        return result;
    }

    async findAll(body = null) {
        if (body) {
            const where = body.where;
            const attributes = body.attributes;
            const order = body.order;

            const result = await db.Attendance.findAll({
                where,
                order,
                attributes,
                raw: true,
                nest: true
            })
            return result;
        }
        const result = await db.Attendance.findAll({});
        return result;
    }

    async filterListAttendance(body) {
        const page = body.page || 1;
        const limit = body.size || 10;
        const where = body.where;
        const attributes = body.attributes;
        const order = body.order;
        const employeeFilter = body.modelEmployee;
        
        const offset = (page - 1) * limit;

        const { count, rows } = await db.Attendance.findAndCountAll({
            where,
            offset,
            limit,
            order: [
                sequelize.fn('field', sequelize.col('status'), 'Pending', 'Reject', 'Approved'),
                ...order
            ],
            attributes,
            raw: true,
            nest: true,
            include: [
                {
                    model: db.Employee, as: 'employeeData',
                    attributes: ['firstName', 'lastName'],
                    ...employeeFilter,
                    include: [
                        {
                            model: db.Employee, as: 'managerData',
                            attributes: ['firstName', 'lastName'],
                        }
                    ]
                },
                {
                    model: db.Employee, as: 'handlerData',
                    attributes: ['firstName', 'lastName']
                },
            ],
        });

        const nextPage = page + 1 > Math.ceil(count / limit) ? null : page + 1;
        const prevPage = page - 1 < 1 ? null : page - 1;

        return {
            total: count,
            currentPage: page,
            nextPage,
            prevPage,
            data: rows,
        };
    }

    async createAttendance(payload) {
        const result = await db.Attendance.create(
            payload,
            {
                raw: true,
                nest: true
            }
        );
        return result;
    }

    async updateAttendance(id, payload) {
        await db.Attendance.update(
            payload
            ,
            {
                where: { id },
            }
        );
    }

    async deleteAttendance(id) {
        await db.Attendance.destroy({
            where: { id }
        });
    }

    async countAttendance() {
        const now = dayjs();
        const countAttendances = await db.Attendance.count({
            where: {
                attendanceDate: now,
                status: { $in: ['Approved', 'Pending'] }
            }
        });
        const countPendingAttendances = await db.Attendance.count({
            where: {
                status: 'Pending'
            }
        });
        return {
            totalAttendances: countAttendances,
            pendingAttendances: countPendingAttendances
        }
    }
}

module.exports = new AttendanceService;