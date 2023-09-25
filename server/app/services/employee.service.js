import db from "../models/index";

class EmployeeService {
    async findById(id) {
        const result = await db.Employee.findOne({
            where: { id },
            include: [
                { model: db.User.scope('secret'), as: 'userData' },
                {
                    model: db.Position, as: 'positionData',
                },
                {
                    model: db.Salary, as: 'salaryData',
                    include: { model: db.Currency, as: 'currencyData' }
                },
            ]
        });
        return result ? result.dataValues : result;
    }

    async findByEmail(email) {
        const result = await db.Employee.findOne({
            where: { email },
            include: [{ model: db.User.scope('secret'), as: 'userData' }]
        });
        return result ? result.dataValues : result;
    }

    async findAll() {
        const result = await db.Employee.findAll({
            include: [
                { model: db.User.scope('secret'), as: 'userData' },
                {
                    model: db.Position, as: 'positionData',
                },
                {
                    model: db.Salary, as: 'salaryData',
                    include: { model: db.Currency, as: 'currencyData' }
                },
            ]
        });
        return result;
    }

    async filterListEmployee(body) {
        const page = body.page || 1;
        const limit = body.size || 10;
        const where = body.where;
        const attributes = body.attributes;
        const order = body.order;

        const offset = (page - 1) * limit;

        const {count, rows} = await db.Employee.findAndCountAll({
            where,
            offset,
            limit,
            order,
            attributes
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

    async createEmployee(payload) {
        const result = await db.Employee.create(
            payload
        );
        return result ? result.dataValues : result;
    }

    async updateEmployee(id, payload) {
        await db.Employee.update(
            payload
            ,
            {
                where: { id },
            }
        );
    }
}

module.exports = new EmployeeService;