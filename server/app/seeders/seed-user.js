'use strict';
const bcrypt = require('bcryptjs');

const hashPassword = async (pw) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(pw, salt);
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('User', [{
      id: '438dd50c-8edd-482c-9fbd-944ed7a53937',
      username: 'admin.hrms',
      password: await hashPassword('admin123'),
      isAdmin: true,
      isActived: true,
      employeeId: '374bcdc0-dceb-4940-952a-d6a2d1cf53f9'
    },
    {
      id: 'cae300cf-1f00-4731-9c7d-2f59496c7225',
      username: 'steven.askew',
      password: await hashPassword('07444440001'),
      isAdmin: false,
      isActived: true,
      employeeId: 'b8dc485c-bf86-46c2-b8fc-78ad135278cc'
    },
    // {
    //   id: 'ca8e837b-8197-4abd-98ba-1ec9e89ef1f9',
    //   username: 'tatiana.breit',
    //   password: await hashPassword('07402222220'),
    //   isAdmin: false,
    //   isActived: true,
    //   employeeId: '478bfe9a-1f75-40e7-830c-5803991d10a9'
    // }
  ], {

    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('User', null, {});
  }
};
