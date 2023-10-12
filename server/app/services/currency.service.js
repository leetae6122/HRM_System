import { MSG_ERROR_NOT_FOUND } from "../utils/message.util";
import db from "./../models/index";
import createError from 'http-errors';

class CurrencyService {
    async findById(id) {
        const result = await db.Currency.findByPk(id, {
            raw: true,
            nest: true
        });
        return result;
    }

    async findByCurrencyCode(code) {
        const result = await db.Currency.findOne({
            where: { code },
            raw: true,
            nest: true
        });
        return result;
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

        const { count, rows } = await db.Currency.findAndCountAll({
            where,
            offset,
            limit,
            order,
            attributes,
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

    async createCurrency(payload) {
        const result = await db.Currency.create(
            payload,
            {
                raw: true,
                nest: true
            }
        );
        return result;
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

    async foundCurrency(currencyId, next) {
        const foundCurrency = await this.findById(currencyId);
        if (!foundCurrency) {
            return next(createError.BadRequest(MSG_ERROR_NOT_FOUND("Currency")));
        }
        return foundCurrency;
    }
}

module.exports = new CurrencyService;