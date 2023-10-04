import db from "./../models/index";

class SalaryService {
    async findById(id) {
        const result = await db.Salary.findOne({
            where: { id },
            include: [
                { model: db.Currency, as: 'currencyData' },
                { model: db.Employee, as: 'employeeData' },
                { model: db.Employee, as: 'adderData' }
            ],
            raw: true,
            nest: true
        });
        return result;
    }

    async findByEmployeeId(employeeId) {
        const result = await db.Salary.findOne({
            where: { employeeId },
            raw: true,
            nest: true
        });
        return result;
    }

    async findAll() {
        const result = await db.Salary.findAll({
            include: [
                { model: db.Currency, as: 'currencyData' },
                { model: db.Employee, as: 'employeeData' },
                { model: db.Employee, as: 'adderData' }
            ]
        });
        return result;
    }

    async filterListSalary(body) {
        const page = body.page || 1;
        const limit = body.size || 10;
        const where = body.where;
        const attributes = body.attributes;
        const order = body.order;
        const employeeWhere = body.employeeWhere;

        const offset = (page - 1) * limit;

        let count = 0;
        let rows = [];
        const data1 = await db.Salary.findAndCountAll({
            where,
            offset,
            limit,
            order,
            attributes,
            include: [
                { model: db.Currency, as: 'currencyData' },
                { model: db.Employee, as: 'employeeData' },
                { model: db.Employee, as: 'adderData' }
            ]
        });

        if (data1.count === 0) {
            const data2 = await db.Salary.findAndCountAll({
                where: {},
                offset,
                limit,
                order,
                attributes,
                include: [
                    { model: db.Currency, as: 'currencyData' },
                    { model: db.Employee, as: 'employeeData', where: employeeWhere },
                    { model: db.Employee, as: 'adderData' }
                ]
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

    async createSalary(payload) {
        const result = await db.Salary.create(
            payload,
            {
                raw: true,
                nest: true
            }
        );
        return result;
    }

    async updateSalary(id, payload) {
        await db.Salary.update(
            payload
            ,
            {
                where: { id },
            }
        );
    }

    async deleteSalary(id) {
        await db.Salary.destroy({
            where: { id },
        });
    }
}

module.exports = new SalaryService;