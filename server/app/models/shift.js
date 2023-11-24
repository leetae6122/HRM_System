'use strict';
const {
    Model
} = require('sequelize');
const _ = require('lodash');
module.exports = (sequelize, DataTypes) => {
    class Shift extends Model {
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
        days: DataTypes.STRING,
        startTime: DataTypes.TIME,
        endTime: DataTypes.TIME,
        overtimeShift: DataTypes.BOOLEAN,
    }, {
        sequelize,
        modelName: 'Shift'
    });

    Shift.beforeValidate((shift) => {
        shift.days = shift.days.join(';');
    })
    Shift.afterFind((data) => {
        if (data || !_.isEmpty(data)) {
            if (_.isArray(data)) {
                return data.map((shift) => {
                    const arr = shift.days.split(';');
                    shift.days = arr.map((item) => Number(item));
                    return shift;
                });
            }
            if (!_.isArray(data)) {
                const arr = data.days.split(';');
                data.days = arr.map((item) => Number(item));
            }
        }
    })

    return Shift;
};