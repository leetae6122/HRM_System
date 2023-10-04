'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Office extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Office.hasMany(models.Department, { foreignKey: 'officeId', as: 'officeData' });
      Office.belongsTo(models.Country, { foreignKey: 'countryId', as: 'countryData' });
    }
  }
  Office.init({
    title: DataTypes.STRING,
    streetAddress: DataTypes.STRING,
    postalCode: DataTypes.INTEGER,
    stateProvince: DataTypes.STRING,
    city: DataTypes.STRING,
    countryId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Office',
    tableName: 'office'
  });

  return Office;
};