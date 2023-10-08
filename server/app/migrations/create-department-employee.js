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
            officeId: {
                allowNull: false,
                type: Sequelize.INTEGER,
                references: {
                    model: 'Office',
                    key: 'id'
                }
            }
        });

        await queryInterface.createTable('Employee', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID
            },
            firstName: {
                allowNull: false,
                type: Sequelize.STRING(80),
            },
            lastName: {
                allowNull: false,
                type: Sequelize.STRING(80)
            },
            email: {
                allowNull: false,
                type: Sequelize.STRING(100),
                unique: true,
            },
            phoneNumber: {
                allowNull: false,
                type: Sequelize.STRING(11),
                unique: true,
            },
            gender: {
                allowNull: false,
                type: Sequelize.BOOLEAN,
            },
            address: {
                type: Sequelize.TEXT,
            },
            dateBirth: {
                allowNull: false,
                type: Sequelize.DATEONLY,
            },
            dateHired: {
                allowNull: false,
                type: Sequelize.DATEONLY,
            },
            dateOff: {
                type: Sequelize.DATEONLY,
            },
            avatarUrl: {
                type: Sequelize.STRING
            },
            positionId: {
                allowNull: false,
                type: Sequelize.INTEGER,
                references: {
                    model: 'Position',
                    key: 'id'
                }
            },
            departmentId: {
                allowNull: false,
                type: Sequelize.INTEGER,
                references: {
                    model: 'Department',
                    key: 'id'
                },
            },
            managerId: {
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

        await queryInterface.addColumn('Department', 'managerId', {
            type: Sequelize.UUID,
            references: {
                model: 'Employee',
                key: 'id'
            },
        });
        await queryInterface.addColumn('Department', 'createdAt', {
            allowNull: false,
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        });
        await queryInterface.addColumn('Department', 'updatedAt', {
            allowNull: false,
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Department');
        await queryInterface.dropTable('Employee');
    }
};