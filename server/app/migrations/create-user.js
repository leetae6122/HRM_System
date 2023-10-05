'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('User', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      username: {
        allowNull: false,
        type: Sequelize.STRING(100),
        unique: true,
      },
      password: {
        type: Sequelize.STRING(60),
        allowNull: false
      },
      isAdmin: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      isActived: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      refreshTokenHash: {
        type: Sequelize.STRING(60),
      },
      resetPasswordHash: {
        type: Sequelize.STRING(60),
      },
      employeeId: {
        allowNull: false,
        type: Sequelize.UUID,
        unique: true,
        references: {
          model: 'Employee',
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
    await queryInterface.dropTable('User');
  }
};