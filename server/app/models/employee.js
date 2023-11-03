'use strict';
const {
    Model
} = require('sequelize');
const uuid = require('uuid');

module.exports = (sequelize, DataTypes) => {
    class Employee extends Model {
        static associate(models) {
            Employee.hasOne(models.User, { foreignKey: 'employeeId', as: 'userData' });

            Employee.hasMany(models.Salary, { foreignKey: 'employeeId', as: 'salaryData' });
            Employee.hasMany(models.Salary, { foreignKey: 'addedBy' });

            Employee.belongsTo(models.Position, { foreignKey: 'positionId', as: 'positionData' });

            Employee.belongsTo(models.Department, { foreignKey: 'departmentId', as: 'departmentData' });
            Employee.hasOne(models.Department, { foreignKey: 'managerId', as: 'manageDepartment' });

            Employee.hasMany(models.Leave, { foreignKey: 'employeeId', as: 'employeeData' });
            Employee.hasMany(models.Leave, { foreignKey: 'handledBy', as: 'handlerData' });

            Employee.hasMany(models.Attendance, { foreignKey: 'employeeId' });
            Employee.hasMany(models.Attendance, { foreignKey: 'adminId' });

            Employee.hasMany(models.Payroll, { foreignKey: 'employeeId' });
            Employee.hasMany(models.Payroll, { foreignKey: 'handledBy' });

            Employee.hasMany(models.Allowance, { foreignKey: 'employeeId' });
            Employee.hasMany(models.Allowance, { foreignKey: 'addedBy' });

            Employee.hasMany(models.RewardPunishment, { foreignKey: 'employeeId' });
            Employee.hasMany(models.RewardPunishment, { foreignKey: 'addedBy' });
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
        citizenshipId: DataTypes.STRING,
        dateHired: DataTypes.DATE,
        dateOff: DataTypes.DATE,
        avatarUrl: DataTypes.STRING,
        positionId: DataTypes.INTEGER,
        departmentId: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'Employee'
    });

    Employee.beforeCreate((employee) => {
        employee.id = uuid.v4();
    })

    return Employee;
};