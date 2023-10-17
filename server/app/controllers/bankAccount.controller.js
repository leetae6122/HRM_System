import {
    MSG_DELETE_SUCCESSFUL,
    MSG_ERROR_DELETE,
    MSG_ERROR_EXISTED,
    MSG_ERROR_ID_EMPTY,
    MSG_UPDATE_SUCCESSFUL,
    MSG_CREATED_SUCCESSFUL
} from "../utils/message.util";
import bankAccountService from "./../services/bankAccount.service";
import createError from 'http-errors';

exports.findById = async (req, res, next) => {
    try {
        const data = await bankAccountService.foundBankAccount(req.params.id, next);

        return res.send({ data });
    } catch (error) {
        return next(error);
    }
}

exports.findAll = async (req, res, next) => {
    try {
        const data = await bankAccountService.findAll();
        return res.send({ data });
    } catch (error) {
        return next(error);
    }
}

exports.getListBankAccount = async (req, res, next) => {
    try {
        const data = await bankAccountService.filterListBankAccount(req.body);
        return res.send({ data });
    } catch (error) {
        return next(error);
    }
}

exports.createBankAccount = async (req, res, next) => {
    try {
        const data = await bankAccountService.createBankAccount(req.body);
        return res.send({ message: MSG_CREATED_SUCCESSFUL("BankAccount"), data });
    } catch (error) {
        return next(error);
    }
}

exports.updateBankAccount = async (req, res, next) => {
    try {
        await bankAccountService.foundBankAccount(req.body.bankAccountId, next);

        await bankAccountService.updateBankAccount(req.body.bankAccountId, req.body);
        return res.send({ message: MSG_UPDATE_SUCCESSFUL });
    } catch (error) {
        return next(error);
    }
}

exports.deleteBankAccount = async (req, res, next) => {
    try {
        if (!req.params.id && Number(req.params.id)) {
            return next(createError.BadRequest(MSG_ERROR_ID_EMPTY("BankAccountId")));
        }
        await bankAccountService.foundBankAccount(req.params.id, next);

        await bankAccountService.deleteBankAccount(req.params.id);
        return res.send({ message: MSG_DELETE_SUCCESSFUL });
    } catch (error) {
        return next(
            createError.BadRequest(MSG_ERROR_DELETE("BankAccount"))
        );
    }
}