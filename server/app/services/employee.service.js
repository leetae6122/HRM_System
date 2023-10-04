import db from "../models/index";
import createError from 'http-errors';

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
            ],
            raw: true,
            nest: true
        });
        return result;
    }

    async findByEmail(email) {
        const result = await db.Employee.findOne({
            where: { email },
            include: [{ model: db.User.scope('secret'), as: 'userData' }],
            raw: true,
            nest: true
        });
        return result;
    }

    async findByPhoneNumber(phoneNumber) {
        const result = await db.Employee.findOne({
            where: { phoneNumber },
            include: [{ model: db.User.scope('secret'), as: 'userData' }],
            raw: true,
            nest: true
        });
        return result;
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

    async getEmployeeNotHaveUser() {
        const data = await db.Employee.findAll({
            include: [
                { model: db.User.scope('secret'), as: 'userData' },
            ]
        });
        const result = data.filter((employee) => employee.userData === null);
        return result;
    }

    async getEmployeeNotHaveSalary() {
        const data = await db.Employee.findAll({
            include: [
                { model: db.Salary, as: 'salaryData' },
            ]
        });
        const result = data.filter((employee) => employee.salaryData === null);
        return result;
    }

    async filterListEmployee(body) {
        const page = body.page || 1;
        const limit = body.size || 10;
        const where = body.where;
        const attributes = body.attributes;
        const order = body.order;

        const offset = (page - 1) * limit;

        const { count, rows } = await db.Employee.findAndCountAll({
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
            payload, {
            raw: true,
            nest: true
        }
        );
        return result;
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

    async deleteEmployee(id) {
        await db.Employee.destroy({
            where: { id }
        });
    }

    async checkEmailExisted(email, next) {
        const emailExist = await this.findByEmail(email);
        if (emailExist) {
            return next(
                createError.BadRequest("Email already exists")
            );
        }
    }

    async checkPhoneNumberExisted(phoneNumber, next) {
        const phoneNumberExist = await this.findByPhoneNumber(phoneNumber);
        if (phoneNumberExist) {
            return next(
                createError.BadRequest("Phone number already exists")
            );
        }
    }

    getFileName(avatarUrl) {
        return avatarUrl.slice(avatarUrl.indexOf('hrm_system'), avatarUrl.lastIndexOf('.'));
    }
}

module.exports = new EmployeeService;