import db from "./../models/index";

class CountryService {
    async findById(id) {
        const result = await db.Country.findByPk(id, {
            raw: true,
            nest: true
        });
        return result;
    }

    async findByIsoCode(isoCode) {
        const result = await db.Country.findOne({
            where: { isoCode },
            raw: true,
            nest: true
        });
        return result;
    }

    async findAll() {
        const result = await db.Country.findAll({});
        return result;
    }

    async filterListCountry(body) {
        const page = body.page || 1;
        const limit = body.size || 10;
        const where = body.where;
        const attributes = body.attributes;
        const order = body.order;

        const offset = (page - 1) * limit;

        const { count, rows } = await db.Country.findAndCountAll({
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

    async createCountry(payload) {
        const result = await db.Country.create(
            payload,
            {
                raw: true,
                nest: true
            }
        );
        return result;
    }

    async updateCountry(id, payload) {
        await db.Country.update(
            payload
            ,
            {
                where: { id },
            }
        );
    }

    async deleteCountry(id) {
        await db.Country.destroy({
            where: { id }
        });
    }
}

module.exports = new CountryService;