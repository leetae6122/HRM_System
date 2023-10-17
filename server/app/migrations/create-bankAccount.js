'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('BankAccount', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.INTEGER,
                autoIncrement: true
            },
            accountName: {
                allowNull: false,
                type: Sequelize.STRING(60),
            },
            bankName: {
                allowNull: false,
                type: Sequelize.STRING(100)
            },
            accountNum: {
                allowNull: false,
                type: Sequelize.STRING(20),
            },
            employeeId: {
                allowNull: false,
                type: Sequelize.UUID,
                references: {
                    model: 'Employee',
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
        await queryInterface.dropTable('BankAccount');
    }
};