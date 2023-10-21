import { MSG_ERROR_NOT_FOUND } from "../utils/message.util";
import db from "./../models/index";
import createError from 'http-errors';
import sequelize from "sequelize";

class DepartmentService {
    async findById(id) {
        const result = await db.Department.findByPk(id, {
            raw: true,
            nest: true
        });
        return result;
    }

    async findAll() {
        const result = await db.Department.findAll({
            include: [
                {
                    model: db.Office, as: 'officeData'
                },
            ],
        });
        return result;
    }

    async filterListDepartment(body) {
        const page = body.page || 1;
        const limit = body.size || 10;
        const where = body.where;
        const attributes = body.attributes;
        const order = body.order;
        const officeFilter = body.modelOffice;

        const offset = (page - 1) * limit;

        const { count, rows } = await db.Department.findAndCountAll({
            where,
            offset,
            limit,
            order,
            attributes,
            include: [
                {
                    model: db.Office, as: 'officeData', ...officeFilter
                },
                {
                    model: db.Employee, as: 'managerData'
                }
            ],
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

    async createDepartment(payload) {
        const result = await db.Department.create(
            payload,
            {
                raw: true,
                nest: true
            }
        );
        return result;
    }

    async updateDepartment(id, payload) {
        await db.Department.update(
            payload
            ,
            {
                where: { id },
            }
        );
    }

    async deleteDepartment(id) {
        await db.Department.destroy({
            where: { id }
        });
    }

    async foundDepartment(departmentId, next) {
        const foundDepartment = await this.findById(departmentId);
        if (!foundDepartment) {
            return next(createError.BadRequest(MSG_ERROR_NOT_FOUND("Department")));
        }
        return foundDepartment;
    }

    async countEmployees() {
        const departments = await db.Department.findAll({
            attributes: [
                'id', 'shortName',
                [sequelize.fn("COUNT", sequelize.col("employeeData.id")), "employeeCount"]
            ],
            include: [{
                model: db.Employee, as: 'employeeData', attributes: []
            },
            {
                model: db.Office, as: 'officeData', attributes: ['title']
            }],
            group: ['Department.id'],
            order: [[sequelize.col('employeeCount'), 'DESC']],
            raw: true,
            nest: true
        });
        return departments;
    }
}

module.exports = new DepartmentService;