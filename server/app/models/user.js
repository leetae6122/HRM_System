'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            User.belongsTo(models.Employee, { foreignKey: 'employeeId', as: 'profile' });
        }
    }
    User.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        username: DataTypes.STRING,
        password: DataTypes.STRING,
        refreshTokenHash: DataTypes.STRING,
        resetPasswordHash: DataTypes.STRING,
        isAdmin: DataTypes.BOOLEAN,
        isActive: DataTypes.BOOLEAN,
        employeeId: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'User',
        scopes: {
            hideToken: {
                attributes: { exclude: ['refreshTokenHash', 'resetPasswordHash'] },
            },
            hidePassword: {
                attributes: { exclude: ['password'] },
            },
            secret: {
                attributes: { exclude: ['refreshTokenHash', 'resetPasswordHash', 'password'] },
            }
        }
    });
    
    User.afterCreate((user) => {
        delete user.dataValues.password;
    })
    User.afterUpdate((user) => {
        delete user.dataValues.password;
        delete user.dataValues.refreshTokenHash;
        delete user.dataValues.resetPasswordHash;
    })

    return User;
};