import db from "../models/index";
import _ from 'lodash';

class WageService {
    async findById(id) {
        const result = await db.Wage.findByPk(id, {
            include: [
                { model: db.Employee, as: 'employeeData' },
                { model: db.Employee, as: 'adderData' }
            ],
            raw: true,
            nest: true
        });
        return result;
    }

    async findByEmployeeId(employeeId) {
        const result = await db.Wage.findOne({
            where: { employeeId, toDate: null },
            raw: true,
            nest: true
        });
        return result;
    }

    async findAllByEmployeeIdWithDate(employeeId, startDate, endDate) {
        const result = await db.Wage.findAll({
            where: {
                employeeId,
                fromDate: { $gte: startDate },
                toDate: { $lte: endDate }
            },
            raw: true,
            nest: true
        });
        return result;
    }

    async findAll() {
        const result = await db.Wage.findAll({
            include: [
                { model: db.Employee, as: 'employeeData' },
                { model: db.Employee, as: 'adderData' }
            ]
        });
        return result;
    }

    async filterListWage(body) {
        const page = body.page || 1;
        const limit = body.size || 10;
        const where = body.where;
        const attributes = body.attributes;
        const order = body.order;
        const employeeFilter = body.modelEmployee;

        const offset = (page - 1) * limit;

        let count = 0;
        let rows = [];
        const data1 = await db.Wage.findAndCountAll({
            where,
            offset,
            limit,
            order,
            attributes,
            include: [
                {
                    model: db.Employee, as: 'employeeData',
                    attributes: ['id', 'firstName', 'lastName'],
                },
                {
                    model: db.Employee, as: 'adderData',
                    attributes: ['id', 'firstName', 'lastName'],
                }
            ],
            raw: true,
            nest: true
        });

        if ((data1.count === 0 || _.isEmpty(where)) && !_.isEmpty(employeeFilter)) {
            const data2 = await db.Wage.findAndCountAll({
                where: {},
                offset,
                limit,
                order,
                attributes,
                include: [
                    {
                        model: db.Employee, as: 'employeeData',
                        attributes: ['id', 'firstName', 'lastName'],
                        ...employeeFilter
                    },
                    {
                        model: db.Employee, as: 'adderData',
                        attributes: ['id', 'firstName', 'lastName'],
                    }
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

    async createWage(payload) {
        const result = await db.Wage.create(
            payload,
            {
                raw: true,
                nest: true
            }
        );
        return result;
    }

    async updateWage(id, payload) {
        await db.Wage.update(
            payload
            ,
            {
                where: { id },
            }
        );
    }

    async updateWageWithEmployeeIdAndToDateNull(employeeId, payload) {
        await db.Wage.update(
            payload
            ,
            {
                where: { employeeId, toDate: { $is: null } },
            }
        );
    }

    async deleteWage(id) {
        await db.Wage.destroy({
            where: { id },
        });
    }
    async deleteWageByEmployeeId(employeeId) {
        await db.Wage.destroy({
            where: { employeeId },
        });
    }
}

module.exports = new WageService;