'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Office', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.INTEGER,
                autoIncrement: true
            },
            title: {
                allowNull: false,
                type: Sequelize.STRING(40),
                unique: true,
            },
            streetAddress: {
                allowNull: false,
                type: Sequelize.STRING(100),
            },
            postalCode: {
                type: Sequelize.INTEGER(10),
            },
            stateProvince: {
                type: Sequelize.STRING(30),
            },
            city: {
                allowNull: false,
                type: Sequelize.STRING(30),
            },
            countryId: {
                allowNull: false,
                type: Sequelize.INTEGER,
                references: {
                    model: 'Country',
                    key: 'id'
                }
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            }
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Office');
    }
};