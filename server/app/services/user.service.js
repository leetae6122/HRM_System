import db from "./../models/index";
import { hashData } from "./../utils/hash.util";
import _ from 'lodash';

class UserService {
    async findById(id) {
        const result = await db.User.findByPk(id, {
            raw: true,
            nest: true
        });
        return result;
    }

    async findByIdSecret(id) {
        const result = await db.User.scope('secret').findByPk(id, {
            include: {
                model: db.Employee,
                as: 'profile',
                include: [
                    {
                        model: db.Position, as: 'positionData',
                        attributes: ['name'],
                    },
                    {
                        model: db.Department, as: 'departmentData',
                        attributes: ['name', 'shortName'],
                        include: [
                            {
                                model: db.Employee, as: 'managerData',
                                attributes: ['firstName', 'lastName', 'email', 'phoneNumber']
                            },
                        ],
                    },
                    {
                        model: db.Department, as: 'manageDepartment',
                        attributes: ['id', 'managerEId'],
                    },
                ]
            },
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
                    {
                        model: db.Position, as: 'positionData',
                        attributes: ['name'],
                    },
                    {
                        model: db.Department, as: 'departmentData',
                        attributes: ['name', 'shortName'],
                        include: [
                            {
                                model: db.Employee, as: 'managerData',
                                attributes: ['firstName', 'lastName', 'email', 'phoneNumber']
                            },
                        ],
                    },
                    {
                        model: db.Department, as: 'manageDepartment',
                        attributes: ['id', 'managerEId'],
                    },
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
        const employeeFilter = body.modelEmployee;

        const offset = (page - 1) * limit;

        let count = 0;
        let rows = [];
        const data1 = await db.User.scope('secret').findAndCountAll({
            where,
            offset,
            limit,
            order,
            attributes,
            include: [{ model: db.Employee, as: 'profile' }],
            raw: true,
            nest: true
        });

        if ((data1.count === 0 || _.isEmpty(where)) && !_.isEmpty(employeeFilter)) {
            const data2 = await db.User.scope('secret').findAndCountAll({
                where: {},
                offset,
                limit,
                order,
                attributes,
                include: [{ model: db.Employee, as: 'profile', ...employeeFilter }],
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

    async deactivateUserByEmployeeId(employeeId) {
        await db.User.update(
            {
                isActive: false
            }
            ,
            {
                where: { employeeId },
            }
        );
    }

    async countUserAdminActived() {
        return await db.User.count(
            {
                where: { isAdmin: 1, isActive: 1 },
            }
        );
    }

    async countUser() {
        const countActiveUsers = await db.User.count({
            where: {
                isActive: true
            }
        });
        const countNotActivedUsers = await db.User.count({
            where: {
                isActive: false
            }
        });
        return {
            activeUsers: countActiveUsers,
            notActivedUsers: countNotActivedUsers
        }
    }
}

module.exports = new UserService;