'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert('Department', [
        {
            id: 1,
            name: 'Marketing',
            shortName: 'MKT',
        },
        {
            id: 2,
            name: 'Hành chính - nhân sự',
            shortName: 'ADP',
        },
        {
            id: 3,
            name: 'Kinh doanh',
            shortName: 'DSN',
        },
        {
            id: 4,
            name: 'Information Technology',
            shortName: 'IT',
        },
        ], {

        });
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Department', null, {});
    }
};
