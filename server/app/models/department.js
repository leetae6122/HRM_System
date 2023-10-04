'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Department extends Model {
    static associate(models) {
      Department.belongsTo(models.Office, { foreignKey: 'officeId', as: 'officeData' });
      Department.hasMany(models.Employee, { foreignKey: 'departmentId' });
    }
  }
  Department.init({
    name: DataTypes.STRING,
    shortName: DataTypes.STRING,
    officeId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Department',
    tableName: 'department'
  });

  return Department;
};