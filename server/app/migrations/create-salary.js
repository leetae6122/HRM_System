'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Salary', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.INTEGER,
                autoIncrement: true
            },
            basicSalary: {
                allowNull: false,
                type: Sequelize.FLOAT(9,2)
            },
            allowance: {
                type: Sequelize.FLOAT(9,2),
                defaultValue: 0
            },
            totalSalary: {
                allowNull: false,
                type: Sequelize.FLOAT(9,2),
            },
            currencyId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Currency',
                    key: 'id'
                }
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
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
            }
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Salary');
    }
};