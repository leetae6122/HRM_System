'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Payroll', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.INTEGER,
                autoIncrement: true
            },
            month: {
                allowNull: false,
                type: Sequelize.DATEONLY,
            },
            startDate: {
                allowNull: false,
                type: Sequelize.DATEONLY,
            },
            endDate: {
                allowNull: false,
                type: Sequelize.DATEONLY,
            },
            hoursWorked: {
                allowNull: false,
                type: Sequelize.FLOAT,
            },
            hoursOvertime: {
                type: Sequelize.FLOAT,
                defaultValue: 0
            },
            totalBasicWage: {
                allowNull: false,
                type: Sequelize.FLOAT,
            },
            totalOvertimeWage: {
                allowNull: false,
                type: Sequelize.FLOAT,
            },
            totalAllowance: {
                allowNull: false,
                type: Sequelize.FLOAT,
            },
            deduction: {
                type: Sequelize.FLOAT,
                defaultValue: 0
            },
            totalPaid: {
                allowNull: false,
                type: Sequelize.FLOAT,
            },
            payDate: {
                type: Sequelize.DATEONLY,
            },
            status: {
                allowNull: false,
                type: Sequelize.ENUM,
                values: ['Pending', 'Paid']
            },
            employeeId: {
                allowNull: false,
                type: Sequelize.STRING,
                references: {
                    model: 'Employee',
                    key: 'id'
                },
            },
            handledBy: {
                type: Sequelize.STRING,
                references: {
                    model: 'Employee',
                    key: 'id'
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
        await queryInterface.dropTable('Payroll');
    }
};