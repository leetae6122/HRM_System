'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class BankAccount extends Model {
        static associate(models) {
            BankAccount.belongsTo(models.Employee, { foreignKey: 'employeeId', as: 'employeeData' });
        }
    }
    BankAccount.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        accountName: DataTypes.STRING,
        bankName: DataTypes.STRING,
        accountNum: DataTypes.STRING,
        employeeId: DataTypes.UUID
    }, {
        sequelize,
        modelName: 'BankAccount'
    });

    return BankAccount;
};