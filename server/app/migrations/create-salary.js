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
            basicHourlySalary: {
                allowNull: false,
                type: Sequelize.FLOAT(10)
            },
            hourlyOvertimeSalary: {
                allowNull: false,
                type: Sequelize.FLOAT(10)
            },
            allowance: {
                type: Sequelize.FLOAT(10),
                defaultValue: 0
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
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            }
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Salary');
    }
};