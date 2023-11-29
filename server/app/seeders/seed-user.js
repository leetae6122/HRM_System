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
      username: 'anh.nguyendiep',
      password: await hashPassword('Anhnguyen123@'),
      isAdmin: false,
      isActive: true,
      employeeId: 'NV20230002'
    },
    {
      id: 3,
      username: 'ha.tran',
      password: await hashPassword('Hatran123@'),
      isAdmin: false,
      isActive: true,
      employeeId: 'NV20230007'
    },
    {
      id: 4,
      username: 'nam.nguyen',
      password: await hashPassword('Namnguyen123@'),
      isAdmin: false,
      isActive: true,
      employeeId: 'NV20230012'
    },
    {
      id: 5,
      username: 'tri.le',
      password: await hashPassword('Trile123@'),
      isAdmin: false,
      isActive: true,
      employeeId: 'NV20230017'
    }
  ], {

    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('User', null, {});
  }
};
