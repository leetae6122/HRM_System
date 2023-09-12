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
      // Location.hasMany(models.Department, { foreignKey: 'locationId', as: 'locationData' });
      // Location.belongsTo(models.Country, { foreignKey: 'countryId', as: 'countryData' });
    }
  }
  Office.init({
    officeTitle: DataTypes.STRING,
    streetAddress: DataTypes.STRING,
    postalCode: DataTypes.STRING,
    city: DataTypes.STRING,
    stateProvince: DataTypes.STRING,
    countryId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Office',
    tableName: 'office'
  });

  return Office;
};