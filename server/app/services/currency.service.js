import db from "./../models/index";

class CurrencyService {
    async findById(id) {
        const result = await db.Currency.findByPk(id);
        return result ? result.dataValues : result;
    }

    async findByCurrencyCode(code) {
        const result = await db.Currency.findOne({
            where: { code }
        });
        return result ? result.dataValues : result;
    }

    async findAll() {
        const result = await db.Currency.findAll({});
        return result;
    }

    async filterListCurrency(body) {
        const page = body.page || 1;
        const limit = body.size || 10;
        const where = body.where;
        const attributes = body.attributes;
        const order = body.order;

        const offset = (page - 1) * limit;

        const {count, rows} = await db.Currency.findAndCountAll({
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

    async createCurrency(payload) {
        const result = await db.Currency.create(
            payload
        );
        return result ? result.dataValues : result;
    }

    async updateCurrency(id, payload) {
        await db.Currency.update(
            payload
            ,
            {
                where: { id },
            }
        );
    }

    async deleteCurrency(id) {
        await db.Currency.destroy({
            where: { id }
        });
    }
}

module.exports = new CurrencyService;