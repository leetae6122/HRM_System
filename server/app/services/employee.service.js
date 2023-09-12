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