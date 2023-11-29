'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Attendance', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.INTEGER,
                autoIncrement: true
            },
            attendanceDate: {
                allowNull: false,
                type: Sequelize.DATEONLY,
            },
            inTime: {
                type: Sequelize.TIME,
            },
            outTime: {
                type: Sequelize.TIME,
            },
            totalHours: {
                type: Sequelize.FLOAT,
            },
            inStatus: {
                type: Sequelize.ENUM,
                values: ['Late In', 'On Time']
            },
            outStatus: {
                type: Sequelize.ENUM,
                values: ['Out Early', 'On Time']
            },
            managerStatus: {
                allowNull: false,
                type: Sequelize.ENUM,
                values: ['Pending', 'Reject', 'Approved']
            },
            adminStatus: {
                allowNull: false,
                type: Sequelize.ENUM,
                values: ['Pending', 'Reject', 'Approved']
            },
            employeeId: {
                allowNull: false,
                type: Sequelize.STRING,
                references: {
                    model: 'Employee',
                    key: 'id'
                },
            },
            adminEId: {
                type: Sequelize.STRING,
                references: {
                    model: 'Employee',
                    key: 'id'
                },
            },
            managerEId: {
                type: Sequelize.STRING,
                references: {
                    model: 'Employee',
                    key: 'id'
                },
            },
            shiftId: {
                allowNull: false,
                type: Sequelize.INTEGER,
                references: {
                    model: 'Shift',
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
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
            }
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Attendance');
    }
};