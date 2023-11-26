'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Leave', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.INTEGER,
                autoIncrement: true
            },
            title: {
                allowNull: false,
                type: Sequelize.STRING(40),
            },
            description: {
                allowNull: false,
                type: Sequelize.TEXT,
            },
            status: {
                allowNull: false,
                type: Sequelize.ENUM,
                values: ['Pending', 'Reject', 'Approved']
            },
            leaveFrom: {
                allowNull: false,
                type: Sequelize.DATEONLY,
            },
            leaveTo: {
                allowNull: false,
                type: Sequelize.DATEONLY,
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
            reasonRejection: {
                type: Sequelize.TEXT,
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
        await queryInterface.dropTable('Leave');
    }
};