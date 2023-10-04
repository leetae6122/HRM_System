import db from "./../models/index";
import { hashData } from "./../utils/hash.util";

class UserService {
    async getUserProfile(id) {
        const result = await db.User.scope('secret').findByPk(id, {
            include: {
                model: db.Employee,
                as: 'profile',
                include: [
                    { model: db.Position, as: 'positionData' },
                    {
                        model: db.Salary, as: 'salaryData',
                        include: { model: db.Currency, as: 'currencyData' }
                    },
                ]
            },
            raw: true,
            nest: true
        });
        return result;
    }

    async findById(id) {
        const result = await db.User.findByPk(id, {
            raw: true,
            nest: true
        });
        return result;
    }

    async findByIdSecret(id) {
        const result = await db.User.scope('secret').findByPk(id, {
            raw: true,
            nest: true
        });
        return result;
    }

    async findByIdHidePass(id) {
        const result = await db.User.scope('hidePassword').findByPk(id, {
            raw: true,
            nest: true
        });
        return result;
    }

    async findByEmployeeId(employeeId) {
        const result = await db.User.findOne({
            where: { employeeId },
            raw: true,
            nest: true
        });
        return result;
    }

    async findByUsernameHideToken(username) {
        const result = await db.User.scope('hideToken').findOne({
            where: { username },
            include: {
                model: db.Employee,
                as: 'profile',
                include: [
                    { model: db.Position, as: 'positionData' },
                    { model: db.Salary, as: 'salaryData' },
                ]
            },
            raw: true,
            nest: true
        });
        return result;
    }

    async findByEmail(email) {
        const result = await db.User.findAll({
            include: {
                model: db.Employee,
                as: 'profile',
                where: {
                    email,
                }
            },
        });
        return result;
    }

    async findAll() {
        const result = await db.User.scope('secret').findAll({
            include: [{ model: db.Employee, as: 'profile' }]
        });
        return result;
    }

    async filterListUser(body) {
        const page = body.page || 1;
        const limit = body.size || 10;
        const where = body.where;
        const attributes = body.attributes;
        const order = body.order;
        const employeeWhere = body.employeeWhere;

        const offset = (page - 1) * limit;

        let count = 0;
        let rows = [];
        const data1 = await db.User.scope('secret').findAndCountAll({
            where,
            offset,
            limit,
            order,
            attributes,
            include: [{ model: db.Employee, as: 'profile' }]
        });

        if (data1.count === 0) {
            const data2 = await db.User.scope('secret').findAndCountAll({
                where: {},
                offset,
                limit,
                order,
                attributes,
                include: [{ model: db.Employee, as: 'profile', where: employeeWhere }]
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


    async createUser(payload) {
        const { password } = payload;
        const hashPassword = hashData(password);
        const result = await db.User.create(
            {
                ...payload,
                password: hashPassword
            },
            {
                raw: true,
                nest: true
            }
        );
        return result;
    }

    async updateUser(id, payload) {
        if (payload.password) {
            payload.password = hashData(payload.password);
        }
        await db.User.update(
            payload
            ,
            {
                where: { id },
            }
        );
    }

    async deleteUser(id) {
        await db.User.destroy({
            where: { id }
        });
    }
}

module.exports = new UserService;