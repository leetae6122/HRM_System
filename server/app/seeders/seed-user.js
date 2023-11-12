'use strict';
const bcrypt = require('bcryptjs');

const hashPassword = async (pw) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(pw, salt);
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('User', [{
      id: 1,
      username: 'admin.hrms',
      password: await hashPassword('Admin123@'),
      isAdmin: true,
      isActive: true,
      employeeId: 'NV20230001'
    },
    {
      id: 2,
      username: 'trung.dinh',
      password: await hashPassword('Trung123@'),
      isAdmin: false,
      isActive: true,
      employeeId: 'NV20230002'
    },
    {
      id: 3,
      username: 'hanh.dao',
      password: await hashPassword('Hanh123@'),
      isAdmin: false,
      isActive: true,
      employeeId: 'NV20230003'
    }
  ], {

    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('User', null, {});
  }
};
