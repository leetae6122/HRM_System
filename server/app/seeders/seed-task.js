'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert('Task', [{
            id: 1,
            title: 'General',
        },
        {
            id: 2,
            title: 'Meeting',
        },
        {
            id: 3,
            title: 'Technology Research',
        },
        {
            id: 4,
            title: 'Training',
        },
        {
            id: 5,
            title: 'Internship',
        }], {

        });
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Task', null, {});
    }
};
