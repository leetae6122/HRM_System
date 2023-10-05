'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Department', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.INTEGER,
                autoIncrement: true
            },
            name: {
                allowNull: false,
                type: Sequelize.STRING(40),
            },
            shortName: {
                type: Sequelize.STRING(8),
            },
            managerId: {
                type: Sequelize.UUID,
                references: {
                    model: 'Employee',
                    key: 'id',
                    deferrable: Sequelize.Deferrable.INITIALLY_DEFERRED
                },
            },
            officeId: {
                allowNull: false,
                type: Sequelize.INTEGER,
                references: {
                    model: 'Office',
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
        await queryInterface.dropTable('Department');
    }
};