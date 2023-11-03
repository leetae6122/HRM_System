'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Department extends Model {
    static associate(models) {
      Department.hasMany(models.Employee, { foreignKey: 'departmentId', as: 'employeeData' });
      Department.belongsTo(models.Employee, { foreignKey: 'managerId', as: 'managerData'});
    }
  }
  Department.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    name: DataTypes.STRING,
    shortName: DataTypes.STRING,
    managerId: DataTypes.UUID,
    createdAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Department'
  });

  return Department;
};