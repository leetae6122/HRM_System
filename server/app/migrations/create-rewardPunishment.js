'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('RewardPunishment', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.INTEGER,
                autoIncrement: true
            },
            type: {
                allowNull: false,
                type: Sequelize.ENUM,
                values: ['Reward', 'Punishment']
            },
            reason: {
                allowNull: false,
                type: Sequelize.STRING(200)
            },
            amount: {
                allowNull: false,
                type: Sequelize.FLOAT
            },
            date: {
                allowNull: false,
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
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            }
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('RewardPunishment');
    }
};