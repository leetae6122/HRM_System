import { MSG_ERROR_NOT_FOUND } from "../utils/message.util";
import db from "./../models/index";
import createError from 'http-errors';

class OfficeService {
    async findById(id) {
        const result = await db.Office.findByPk(id, {
            raw: true,
            nest: true
        });
        return result;
    }

    async findByTitleOffice(title) {
        const result = await db.Office.findOne({
            where: { title },
            raw: true,
            nest: true
        });
        return result;
    }

    async findAll() {
        const result = await db.Office.findAll({});
        return result;
    }

    async filterListOffice(body) {
        const page = body.page || 1;
        const limit = body.size || 10;
        const where = body.where;
        const attributes = body.attributes;
        const order = body.order;

        const offset = (page - 1) * limit;

        const { count, rows } = await db.Office.findAndCountAll({
            where,
            offset,
            limit,
            order,
            attributes,
            include: [
                {
                    model: db.Country, as: 'countryData',
                },
            ],
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

    async createOffice(payload) {
        const result = await db.Office.create(
            payload,
            {
                raw: true,
                nest: true
            }
        );
        return result;
    }

    async updateOffice(id, payload) {
        await db.Office.update(
            payload
            ,
            {
                where: { id },
            }
        );
    }

    async deleteOffice(id) {
        await db.Office.destroy({
            where: { id }
        });
    }

    async foundOffice(officeId, next) {
        const foundOffice = await this.findById(officeId);
        if (!foundOffice) {
            return next(createError.BadRequest(MSG_ERROR_NOT_FOUND("Office")));
        }
        return foundOffice
    }
}

module.exports = new OfficeService;