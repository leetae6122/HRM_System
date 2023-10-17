'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Department extends Model {
    static associate(models) {
      Department.belongsTo(models.Office, { foreignKey: 'officeId', as: 'officeData' });

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
    officeId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Department'
  });

  return Department;
};