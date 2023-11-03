'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Allowance', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.INTEGER,
                autoIncrement: true
            },
            title: {
                allowNull: false,
                type: Sequelize.STRING(60)
            },
            amount: {
                allowNull: false,
                type: Sequelize.FLOAT(10)
            },
            startDate: {
                allowNull: false,
                type: Sequelize.DATEONLY,
            },
            endDate: {
                type: Sequelize.DATEONLY,
            },
            employeeId: {
                allowNull: false,
                type: Sequelize.UUID,
                references: {
                    model: 'Employee',
                    key: 'id'
                }
            },
            addedBy: {
                allowNull: false,
                type: Sequelize.UUID,
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
        await queryInterface.dropTable('Allowance');
    }
};