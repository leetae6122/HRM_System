'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Wage', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.INTEGER,
                autoIncrement: true
            },
            basicHourlyWage: {
                allowNull: false,
                type: Sequelize.FLOAT
            },
            fromDate: {
                allowNull: false,
                type: Sequelize.DATEONLY,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },
            toDate: {
                type: Sequelize.DATEONLY,
            },
            employeeId: {
                allowNull: false,
                type: Sequelize.STRING,
                references: {
                    model: 'Employee',
                    key: 'id'
                }
            },
            adminEId: {
                allowNull: false,
                type: Sequelize.STRING,
                references: {
                    model: 'Employee',
                    key: 'id',
                },
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
            }
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Wage');
    }
};