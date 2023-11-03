import { MSG_ERROR_NOT_FOUND } from "../utils/message.util";
import db from "./../models/index";
import createError from 'http-errors';

class RewardPunishmentService {
    async findById(id) {
        const result = await db.RewardPunishment.findByPk(id, {
            include: [
                { model: db.Employee, as: 'employeeData' },
                { model: db.Employee, as: 'adderData' }
            ],
            raw: true,
            nest: true
        });
        return result;
    }

    async findAll() {
        const result = await db.RewardPunishment.findAll({});
        return result;
    }

    async filterListRewardPunishment(body) {
        const page = body.page || 1;
        const limit = body.size || 10;
        const where = body.where;
        const attributes = body.attributes;
        const order = body.order;
        const employeeFilter = body.modelEmployee;

        const offset = (page - 1) * limit;

        const { count, rows } = await db.RewardPunishment.findAndCountAll({
            where,
            offset,
            limit,
            order,
            attributes,
            include: [
                { model: db.Employee, as: 'employeeData', ...employeeFilter },
                { model: db.Employee, as: 'adderData' }
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

    async createRewardPunishment(payload) {
        const result = await db.RewardPunishment.create(
            payload,
            {
                raw: true,
                nest: true
            }
        );
        return result;
    }

    async updateRewardPunishment(id, payload) {
        await db.RewardPunishment.update(
            payload
            ,
            {
                where: { id },
            }
        );
    }

    async deleteRewardPunishment(id) {
        await db.RewardPunishment.destroy({
            where: { id }
        });
    }

    async foundRewardPunishment(RewardPunishmentId, next) {
        const foundRewardPunishment = await this.findById(RewardPunishmentId);
        if (!foundRewardPunishment) {
            return next(createError.BadRequest(MSG_ERROR_NOT_FOUND("RewardPunishment")));
        }
        return foundRewardPunishment;
    }
}

module.exports = new RewardPunishmentService;