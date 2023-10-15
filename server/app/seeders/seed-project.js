'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert('Project', [{
            id: 1,
            title: 'Training of interns',
            summary: 'Training',
            detail: null,
            startDate: '2023-10-12',
            endDate: null,
            status: 'Running'
        },
        {
            id: 2,
            title: 'Custom support service operation...',
            summary: 'Custom support',
            detail: null,
            startDate: '2023-10-20',
            endDate: '2023-11-20',
            status: 'Upcoming'
        },
        {
            id: 3,
            title: 'Build an auto car website',
            summary: 'Build a website',
            detail: null,
            startDate: '2023-10-16',
            endDate: '2023-12-20',
            status: 'Upcoming'
        },
        ], {

        });
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Project', null, {});
    }
};
