import sequelize from "sequelize";
import db from "./../models/index";
import dayjs from 'dayjs';
import _ from 'lodash';

class LeaveService {
    async findById(id) {
        const result = await db.Leave.findByPk(id, {
            include: [
                {
                    model: db.Employee, as: 'employeeData',
                    attributes: ['id', 'firstName', 'lastName', 'email']
                },
                {
                    model: db.Employee, as: 'handlerData',
                    attributes: ['id', 'firstName', 'lastName', 'email']
                },
            ],
            raw: true,
            nest: true
        });
        return result;
    }

    async findByLeaveCode(code) {
        const result = await db.Leave.findOne({
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

            const result = await db.Leave.findAll({
                where,
                order,
                attributes,
                raw: true,
                nest: true
            })
            return result;
        }
        const result = await db.Leave.findAll({});
        return result;
    }

    async filterListLeave(body) {
        const page = body.page || 1;
        const limit = body.size || 10;
        const where = body.where;
        const attributes = body.attributes;
        const order = body.order;
        const employeeFilter = body.modelEmployee;

        const offset = (page - 1) * limit;

        let count = 0;
        let rows = [];
        const data1 = await db.Leave.findAndCountAll({
            where,
            offset,
            limit,
            order: [
                sequelize.fn('field', sequelize.col('status'), 'Pending', 'Reject', 'Approved'),
                ...order
            ],
            attributes,
            include: [
                {
                    model: db.Employee, as: 'employeeData',
                    attributes: ['id', 'firstName', 'lastName'],
                },
                {
                    model: db.Employee, as: 'handlerData',
                    attributes: ['id', 'firstName', 'lastName']
                },
            ],
            raw: true,
            nest: true
        });

        if ((data1.count === 0 || _.isEmpty(where)) && !_.isEmpty(employeeFilter)) {
            const data2 = await db.Leave.findAndCountAll({
                where: {},
                offset,
                limit,
                order: [
                    sequelize.fn('field', sequelize.col('status'), 'Pending', 'Reject', 'Approved'),
                    ...order
                ],
                attributes,
                include: [
                    {
                        model: db.Employee, as: 'employeeData',
                        attributes: ['id', 'firstName', 'lastName'],
                        ...employeeFilter
                    },
                    {
                        model: db.Employee, as: 'handlerData',
                        attributes: ['id', 'firstName', 'lastName']
                    },
                ],
                raw: true,
                nest: true
            });
            count = data2.count;
            rows = data2.rows;
        } else {
            count = data1.count;
            rows = data1.rows;
        }

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

    async createLeave(payload) {
        const result = await db.Leave.create(
            payload,
            {
                raw: true,
                nest: true
            }
        );
        return result;
    }

    async updateLeave(id, payload) {
        await db.Leave.update(
            payload
            ,
            {
                where: { id },
            }
        );
    }

    async deleteLeave(id) {
        await db.Leave.destroy({
            where: { id }
        });
    }

    async countLeave() {
        const startDate = dayjs().startOf('month').toDate();
        const endDate = dayjs().endOf('month').toDate();

        const countLeaves = await db.Leave.count({
            where: {
                $and: [
                    {
                        $or: [
                            { leaveFrom: { $between: [startDate, endDate] } },
                            { leaveTo: { $between: [startDate, endDate] } },
                        ]
                    },
                    { status: 'Approved' }
                ]
            }
        });
        const countPendingLeaves = await db.Leave.count({
            where: {
                status: 'Pending'
            }
        });
        return {
            totalLeaves: countLeaves,
            pendingLeaves: countPendingLeaves
        }
    }
}

module.exports = new LeaveService;