import db from "./../models/index";

class DepartmentService {
    async findById(id) {
        const result = await db.Department.findByPk(id, {
            raw: true,
            nest: true
        });
        return result;
    }
    
    async findAll() {
        const result = await db.Department.findAll({});
        return result;
    }

    async filterListDepartment(body) {
        const page = body.page || 1;
        const limit = body.size || 10;
        const where = body.where;
        const attributes = body.attributes;
        const order = body.order;

        const offset = (page - 1) * limit;

        const { count, rows } = await db.Department.findAndCountAll({
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
}

module.exports = new DepartmentService;