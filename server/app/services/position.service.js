import { MSG_ERROR_NOT_FOUND } from "../utils/message.util";
import db from "./../models/index";
import createError from 'http-errors';

class PositionService {
    async findById(id) {
        const result = await db.Position.findOne({
            where: { id },
            include: { model: db.Currency, as: 'currencyData' },
            raw: true,
            nest: true
        });
        return result;
    }

    async findByPositionName(positionName) {
        const result = await db.Position.findOne({
            where: { name: positionName },
            raw: true,
            nest: true
        });
        return result;
    }

    async findAll() {
        const result = await db.Position.findAll({
            include: { model: db.Currency, as: 'currencyData' }
        });
        return result;
    }

    async filterListPosition(body) {
        const page = body.page || 1;
        const limit = body.size || 10;
        const where = body.where;
        const attributes = body.attributes;
        const order = body.order;

        const offset = (page - 1) * limit;

        const { count, rows } = await db.Position.findAndCountAll({
            where,
            offset,
            limit,
            order,
            attributes,
            include: { model: db.Currency, as: 'currencyData' },
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

    async createPosition(payload) {
        const result = await db.Position.create(
            payload,
            {
                raw: true,
                nest: true
            }
        );
        return result;
    }

    async updatePosition(id, payload) {
        await db.Position.update(
            payload
            ,
            {
                where: { id },
            }
        );
    }

    async deletePosition(id) {
        await db.Position.destroy({
            where: { id }
        });
    }

    async foundPosition(positionId, next) {
        const foundPosition = await this.findById(positionId);
        if (!foundPosition) {
            return next(
                createError.NotFound(MSG_ERROR_NOT_FOUND("Position"))
            );
        }
        return foundPosition;
    }
}

module.exports = new PositionService;