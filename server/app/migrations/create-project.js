'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Project', {
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
      summary: {
        allowNull: false,
        type: Sequelize.STRING(60),
      },
      details: {
        type: Sequelize.TEXT,
      },
      startDate: {
        allowNull: false,
        type: Sequelize.DATEONLY,
      },
      endDate: {
        type: Sequelize.DATEONLY,
      },
      status: {
        allowNull: false,
        type: Sequelize.ENUM,
        values: ['Upcoming', 'Running', 'Complete']
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
    await queryInterface.dropTable('Project');
  }
};