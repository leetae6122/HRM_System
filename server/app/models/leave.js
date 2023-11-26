'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Leave extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Leave.belongsTo(models.Employee, { foreignKey: 'employeeId', as: 'employeeData' });
            Leave.belongsTo(models.Employee, { foreignKey: 'adminEId', as: 'handlerData' });
        }
    }
    Leave.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        title: DataTypes.STRING,
        description: DataTypes.TEXT,
        status: DataTypes.ENUM('Pending', 'Reject', 'Approved'),
        leaveFrom: DataTypes.DATEONLY,
        leaveTo: DataTypes.DATEONLY,
        employeeId: DataTypes.STRING,
        adminEId: DataTypes.STRING,
        reasonRejection: DataTypes.TEXT,
    }, {
        sequelize,
        modelName: 'Leave'
    });

    return Leave;
};