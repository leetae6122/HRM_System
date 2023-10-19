import { MSG_ERROR_NOT_FOUND } from "../utils/message.util";
import db from "./../models/index";
import createError from 'http-errors';

class BankAccountService {
    async findById(id) {
        const result = await db.BankAccount.findByPk(id, {
            raw: true,
            nest: true
        });
        return result;
    }

    async findAll() {
        const result = await db.BankAccount.findAll({});
        return result;
    }

    async createBankAccount(payload) {
        const result = await db.BankAccount.create(
            payload,
            {
                raw: true,
                nest: true
            }
        );
        return result;
    }

    async updateBankAccount(id, payload) {
        await db.BankAccount.update(
            payload
            ,
            {
                where: { id },
            }
        );
    }

    async deleteBankAccount(id) {
        await db.BankAccount.destroy({
            where: { id }
        });
    }

    async foundBankAccount(BankAccountId, next) {
        const foundBankAccount = await this.findById(BankAccountId);
        if (!foundBankAccount) {
            return next(createError.BadRequest(MSG_ERROR_NOT_FOUND("BankAccount")));
        }
        return foundBankAccount;
    }
}

module.exports = new BankAccountService;