'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert('Department', [{
            id: 1,
            name: 'Administration',
            shortName: 'ADM',
            officeId: 1,
        },
        {
            id: 2,
            name: 'Technical support',
            shortName: 'TNS',
            officeId: 1,
        },
        {
            id: 3,
            name: 'Designing',
            shortName: 'DSN',
            officeId: 1,
        },
        {
            id: 4,
            name: 'Application development',
            shortName: 'DEV',
            officeId: 1,
        },
        {
            id: 5,
            name: 'Marketing',
            shortName: 'MKT',
            officeId: 1,
        },
        {
            id: 6,
            name: 'Accounting',
            shortName: 'ACT',
            // managerId: '',
            officeId: 1,
        },
        ], {

        });
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Department', null, {});
    }
};
