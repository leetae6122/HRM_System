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
                type: Sequelize.FLOAT(2),
            },
            hoursOvertime: {
                type: Sequelize.FLOAT(2),
                defaultValue: 0
            },
            deduction: {
                type: Sequelize.FLOAT(10),
                defaultValue: 0
            },
            totalPaid: {
                allowNull: false,
                type: Sequelize.FLOAT(10),
            },
            payDate: {
                type: Sequelize.DATEONLY,
            },
            status: {
                allowNull: false,
                type: Sequelize.ENUM,
                values: ['Pending', 'Paid']
            },
            wageId: {
                allowNull: false,
                type: Sequelize.INTEGER,
                references: {
                    model: 'Wage',
                    key: 'id'
                },
            },
            employeeId: {
                allowNull: false,
                type: Sequelize.UUID,
                references: {
                    model: 'Employee',
                    key: 'id'
                },
            },
            handledBy: {
                type: Sequelize.UUID,
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