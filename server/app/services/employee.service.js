import db from "../models/index";
import createError from 'http-errors';
import { MSG_ERROR_NOT_FOUND } from "../utils/message.util";

class EmployeeService {
    async findById(id) {
        const result = await db.Employee.findByPk(id, {
            include: [
                { model: db.User.scope('secret'), as: 'userData' },
                {
                    model: db.Position, as: 'positionData',
                },
                {
                    model: db.Department, as: 'departmentData',
                    attributes: ['name', 'shortName'],
                    include: [
                        {
                            model: db.Employee, as: 'managerData',
                            attributes: ['id', 'firstName', 'lastName', 'email', 'phoneNumber']
                        },
                    ],
                },
                {
                    model: db.Department, as: 'manageDepartment',
                    attributes: ['id', 'managerEId'],
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
            where: { dateOff: null },
            include: [
                {
                    model: db.Department, as: 'departmentData',
                    attributes: ['name', 'shortName'],
                },
            ],
            raw: true,
            nest: true
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
            attributes,
            raw: true,
            nest: true
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

    async getManageDepartment(employeeId) {
        const result = await db.Employee.findOne({
            where: { id: employeeId },
            include: [{ model: db.Department, as: 'manageDepartment' }],
            raw: true,
            nest: true
        });
        return result;
    }

    async getListEmployeeByDepartment(departmentId) {
        const data = await db.Employee.findAll({
            where: {
                departmentId
            },
        });
        return data;
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

    async foundEmployee(employeeId, next, manager = false) {
        const foundEmployee = await this.findById(employeeId);
        if (!foundEmployee) {
            return next(
                createError.NotFound(MSG_ERROR_NOT_FOUND(manager ? "Manager Employee" : "Employee"))
            );
        }
        return foundEmployee;
    }

    async checkEmployeeIsWorking(employeeId) {
        return await db.Employee.findOne({
            where: {
                id: employeeId,
                dateOff: { $is: null }
            },
            raw: true,
            nest: true
        });

    }

    async countEmployee() {
        const countEmployees = await db.Employee.count({});
        const countCurrentEmployees = await db.Employee.count({
            where: {
                dateOff: null
            }
        });
        return {
            currentEmployees: countCurrentEmployees,
            formerEmployees: countEmployees - countCurrentEmployees
        }
    }

    getFileName(avatarUrl) {
        return avatarUrl.slice(avatarUrl.indexOf('hrm_system'), avatarUrl.lastIndexOf('.'));
    }
}

module.exports = new EmployeeService;