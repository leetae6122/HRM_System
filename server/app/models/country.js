'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Country extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // Country.hasMany(models.Location, { foreignKey: 'countryId', as: 'countryData' });
        }
    }
    Country.init({
        name: DataTypes.STRING,
        countryCode: DataTypes.STRING,
        countryName: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'Country',
        tableName: 'country'
    });

    return Country;
};