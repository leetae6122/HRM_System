'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class RewardPunishment extends Model {
        static associate(models) {
            RewardPunishment.belongsTo(models.Employee, { foreignKey: 'employeeId', as: 'employeeData' });
            RewardPunishment.belongsTo(models.Employee, { foreignKey: 'addedBy', as: 'adderData' });
            // RewardPunishment.hasMany(models.Payroll, { foreignKey: 'rewardPunishmentId', as: 'rewardPunishmentData' });
        }
    }
    RewardPunishment.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        type: DataTypes.ENUM('Reward', 'Punishment'),
        reason: DataTypes.STRING,
        amount: DataTypes.FLOAT,
        date: DataTypes.DATEONLY,
        employeeId: DataTypes.UUID,
        addedBy: DataTypes.UUID
    }, {
        sequelize,
        modelName: 'RewardPunishment'
    });

    return RewardPunishment;
};