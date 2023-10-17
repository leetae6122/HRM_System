import { MSG_ERROR_NOT_FOUND } from "../utils/message.util";
import db from "./../models/index";
import createError from 'http-errors';

class TaskService {
    async findById(id) {
        const result = await db.Task.findByPk(id, {
            raw: true,
            nest: true
        });
        return result;
    }

    async findAll() {
        const result = await db.Task.findAll({});
        return result;
    }

    async filterListTask(body) {
        const page = body.page || 1;
        const limit = body.size || 10;
        const where = body.where;
        const attributes = body.attributes;
        const order = body.order;

        const offset = (page - 1) * limit;

        const { count, rows } = await db.Task.findAndCountAll({
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

    async createTask(payload) {
        const result = await db.Task.create(
            payload,
            {
                raw: true,
                nest: true
            }
        );
        return result;
    }

    async updateTask(id, payload) {
        await db.Task.update(
            payload
            ,
            {
                where: { id },
            }
        );
    }

    async deleteTask(id) {
        await db.Task.destroy({
            where: { id }
        });
    }

    async foundTask(taskId, next) {
        const foundTask = await this.findById(taskId);
        if (!foundTask) {
            return next(createError.BadRequest(MSG_ERROR_NOT_FOUND("Task")));
        }
        return foundTask
    }
}

module.exports = new TaskService;