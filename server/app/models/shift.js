'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Shift extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Shift.hasMany(models.Attendance, { foreignKey: 'shiftId', as: 'shiftData' });
        }
    }
    Shift.init({
        id: {
            type: DataTypes.INTEGER,
            describe: DataTypes.STRING,
            primaryKey: true
        },
        name: DataTypes.STRING,
        startTime: DataTypes.TIME,
        endTime: DataTypes.TIME,
        overtimeShift: DataTypes.BOOLEAN,
    }, {
        sequelize,
        modelName: 'Shift'
    });

    return Shift;
};