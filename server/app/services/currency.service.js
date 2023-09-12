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