'use strict';
const {
    Model
} = require('sequelize');
const uuid = require('uuid');

module.exports = (sequelize, DataTypes) => {
    class Employee extends Model {
        static associate(models) {
            Employee.hasOne(models.User, { foreignKey: 'employeeId', as: 'userData' });

            Employee.hasOne(models.Salary, { foreignKey: 'employeeId', as: 'salaryData' });
            Employee.hasMany(models.Salary, { foreignKey: 'addedBy', as: 'salaryAddedData' });

            Employee.belongsTo(models.Position, { foreignKey: 'positionId', as: 'positionData' });
            Employee.belongsTo(models.Employee, { foreignKey: 'managerId', as: 'managerData' });

            Employee.belongsTo(models.Department, { foreignKey: 'departmentId', as: 'departmentData' });
            Employee.hasOne(models.Department, { foreignKey: 'managerId', as: 'manageDepartment' });

            Employee.hasMany(models.Leave, { foreignKey: 'employeeId', as: 'employeeData' });
            Employee.hasMany(models.Leave, { foreignKey: 'handledBy', as: 'handlerData' });

            Employee.hasMany(models.Attendance, { foreignKey: 'employeeId' });
            Employee.hasMany(models.Attendance, { foreignKey: 'handledBy' });

            Employee.hasMany(models.Payroll, { foreignKey: 'employeeId' });
            Employee.hasMany(models.Payroll, { foreignKey: 'handledBy' });

            Employee.hasOne(models.BankAccount, { foreignKey: 'employeeId', as: 'backAccountData' });
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
        departmentId: DataTypes.INTEGER,
        managerId: DataTypes.UUID
    }, {
        sequelize,
        modelName: 'Employee'
    });

    Employee.beforeCreate((employee) => {
        employee.id = uuid.v4();
    })

    return Employee;
};