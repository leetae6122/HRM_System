'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Position', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
        autoIncrement: true
      },
      positionName: {
        allowNull: false,
        type: Sequelize.STRING(60),
        unique: true,
      },
      minSalary: {
        allowNull: false,
        type: Sequelize.FLOAT(10)
      },
      maxSalary: {
        type: Sequelize.FLOAT(10)
      },
      currencyId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Currency',
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
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Position');
  }
};