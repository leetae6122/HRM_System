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
            // Leave.belongsTo(models.Employee, { foreignKey: 'employeeId', as: 'employeeData' });
            // Leave.belongsTo(models.Employee, { foreignKey: 'acceptBy', as: 'accepterData' });
        }
    }
    Leave.init({
        title: DataTypes.STRING,
        description: DataTypes.TEXT,
        status: DataTypes.INTEGER,
        leaveFrom: DataTypes.DATE,
        leaveTo: DataTypes.DATE,
        employeeId: DataTypes.UUID,
        handledBy: DataTypes.UUID,
        reasonRejection: DataTypes.TEXT,
    }, {
        sequelize,
        modelName: 'Leave'
    });

    return Leave;
};