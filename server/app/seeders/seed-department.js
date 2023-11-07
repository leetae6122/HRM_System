'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert('Department', [{
            id: 1,
            name: 'Administration',
            shortName: 'ADM',
        },
        {
            id: 2,
            name: 'Technical support',
            shortName: 'TNS',
        },
        {
            id: 3,
            name: 'Designing',
            shortName: 'DSN',
        },
        {
            id: 4,
            name: 'Application development',
            shortName: 'DEV',
        },
        {
            id: 5,
            name: 'Marketing',
            shortName: 'MKT',
        },
        {
            id: 6,
            name: 'Accounting',
            shortName: 'ACT',
        },
        ], {

        });
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Department', null, {});
    }
};
