import db from "./../models/index";

class LeaveService {
    async findById(id) {
        const result = await db.Leave.findByPk(id, {
            include: [
                {
                    model: db.Employee, as: 'employeeData',
                    attributes: ['firstName', 'lastName', 'email']
                },
                {
                    model: db.Employee, as: 'handlerData',
                    attributes: ['firstName', 'lastName', 'email']
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

    async findAll() {
        const result = await db.Leave.findAll({});
        return result;
    }

    async filterListLeave(body) {
        const page = body.page || 1;
        const limit = body.size || 10;
        const where = body.where;
        const attributes = body.attributes;
        const order = body.order;
        const employeeWhere = body.employeeWhere;

        const offset = (page - 1) * limit;

        const { count, rows } = await db.Leave.findAndCountAll({
            where,
            offset,
            limit,
            order,
            attributes,
            raw: true,
            nest: true,
            include: [
                {
                    model: db.Employee, as: 'employeeData',
                    attributes: ['firstName', 'lastName'],
                    where: employeeWhere
                },
                {
                    model: db.Employee, as: 'handlerData',
                    attributes: ['firstName', 'lastName']
                },
            ],
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
}

module.exports = new LeaveService;