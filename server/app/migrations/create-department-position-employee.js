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
                allowNull: false,
                type: Sequelize.STRING(8),
                unique: true,
            },
        });

        await queryInterface.createTable('Position', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.INTEGER,
                autoIncrement: true
            },
            name: {
                allowNull: false,
                type: Sequelize.STRING(60),
                unique: true,
            },
            minHourlyWage: {
                allowNull: false,
                type: Sequelize.FLOAT
            },
            maxHourlyWage: {
                type: Sequelize.FLOAT
            },
            departmentId: {
                allowNull: false,
                type: Sequelize.INTEGER,
                references: {
                    model: 'Department',
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

        await queryInterface.createTable('Employee', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.STRING(10)
            },
            firstName: {
                allowNull: false,
                type: Sequelize.STRING(30),
            },
            lastName: {
                allowNull: false,
                type: Sequelize.STRING(30)
            },
            email: {
                allowNull: false,
                type: Sequelize.STRING(60),
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
            citizenshipId: {
                allowNull: false,
                type: Sequelize.STRING(20),
                unique: true,
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

        await queryInterface.addColumn('Department', 'managerEId', {
            type: Sequelize.STRING,
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
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Department');
        await queryInterface.dropTable('Position');
        await queryInterface.dropTable('Employee');
    }
};