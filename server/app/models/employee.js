'use strict';
const {
    Model
} = require('sequelize');
const uuid = require('uuid');

module.exports = (sequelize, DataTypes) => {
    class Employee extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Employee.hasOne(models.User, { foreignKey: 'employeeId', as: 'userData' });

            Employee.hasOne(models.Salary, { foreignKey: 'employeeId', as: 'salaryData' });
            Employee.hasMany(models.Salary, { foreignKey: 'addedBy', as: 'salaryAddedData' });

            Employee.belongsTo(models.Position, { foreignKey: 'positionId', as: 'positionData' });
            // Employee.belongsTo(models.Employee, { foreignKey: 'managerId', as: 'managerData' });

            // Employee.belongsTo(models.Department, { foreignKey: 'departmentId', as: 'departmentData' });
            Employee.hasOne(models.Department, { foreignKey: 'managerId', as: 'managerData'});

            // Employee.hasMany(models.Leave, { foreignKey: 'employeeId', as: 'employeeData' });
            // Employee.hasMany(models.Leave, { foreignKey: 'acceptBy', as: 'accepterData' });
        }
    }
    Employee.init({
        id: {
            type: DataTypes.UUID,
            primaryKey: true
        },
        firstName: DataTypes.STRING,
        lastName: DataTypes.STRING,
        email: DataTypes.STRING,
        phoneNumber: DataTypes.STRING,
        gender: DataTypes.BOOLEAN,
        address: DataTypes.TEXT,
        dateBirth: DataTypes.DATE,
        dateHired: DataTypes.DATE,
        dateOff: DataTypes.DATE,
        avatarUrl: DataTypes.STRING,
        positionId: DataTypes.INTEGER,
        // departmentId: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'Employee'
    });

    Employee.beforeCreate((employee) => {
        employee.id = uuid.v4();
    })

    return Employee;
};