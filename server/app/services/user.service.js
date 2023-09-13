import db from "./../models/index";
import { hashData } from "./../utils/hash.util";

class UserService {
    async findById(id) {
        const result = await db.User.findByPk(id);
        return result ? result.dataValues : result;
    }

    async findByIdSecret(id) {
        const result = await db.User.scope('secret').findByPk(id);
        return result ? result.dataValues : result;
    }

    async findByIdHidePass(id) {
        const result = await db.User.scope('hidePassword').findByPk(id);
        return result ? result.dataValues : result;
    }

    async findByEmployeeId(employeeId) {
        const result = await db.User.findOne({
            where: { employeeId }
        });
        return result ? result.dataValues : result;
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
        });
        return result ? result.dataValues : result;
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

    async createUser(payload) {
        const { password } = payload;
        const hashPassword = hashData(password);
        const result = await db.User.create(
            {
                ...payload,
                password: hashPassword
            }
        );
        return result ? result.dataValues : result;
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
}

module.exports = new UserService;