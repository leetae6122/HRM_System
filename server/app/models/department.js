'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Department extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Department.belongsTo(models.Employee, { foreignKey: 'managerId', as: 'managerData' });
      // Department.hasMany(models.Employee, { foreignKey: 'departmentId' });
      Department.belongsTo(models.Office, { foreignKey: 'officeId', as: 'officeData' });
    }
  }
  Department.init({
    name: DataTypes.STRING,
    manageId: DataTypes.UUID,
    officeId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Department',
    tableName: 'department',

  });

  return Department;
};