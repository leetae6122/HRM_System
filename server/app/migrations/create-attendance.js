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
            description: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            attendanceDate: {
                allowNull: false,
                type: Sequelize.DATEONLY,
            },
            hourSpent: {
                allowNull: false,
                type: Sequelize.FLOAT(2),
            },
            hourOT: {
                type: Sequelize.FLOAT(2),
            },
            status: {
                allowNull: false,
                type: Sequelize.ENUM,
                values: ['Pending', 'Reject', 'Approved']
            },
            place: {
                allowNull: false,
                type: Sequelize.ENUM,
                values: ['Office', 'At Home']
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
            taskId: {
                allowNull: false,
                type: Sequelize.INTEGER,
                references: {
                    model: 'Task',
                    key: 'id'
                },
            },
            projectId: {
                allowNull: false,
                type: Sequelize.INTEGER,
                references: {
                    model: 'Project',
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
        await queryInterface.dropTable('Attendance');
    }
};