'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert('Shift', [{
            id: 1,
            name: 'Morning',
            days: '1;2;3;4;5',
            startTime: '08:00:00',
            endTime: '12:00:00',
            overtimeShift: false
        },
        {
            id: 2,
            name: 'Afternoon',
            days: '1;2;3;4;5',
            startTime: '13:00:00',
            endTime: '17:00:00',
            overtimeShift: false
        },
        {
            id: 3,
            name: 'Overtime',
            days: '1;2;3;4;5',
            startTime: '18:00:00',
            endTime: '20:00:00',
            overtimeShift: true
        },
        {
            id: 4,
            name: 'Weekend - Morning',
            days: '0;6',
            startTime: '08:00:00',
            endTime: '12:00:00',
            overtimeShift: true
        },
        {
            id: 5,
            name: 'Weekend - Afternoon',
            days: '0;6',
            startTime: '13:00:00',
            endTime: '17:00:00',
            overtimeShift: true
        },
        ], {

        });
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Shift', null, {});
    }
};
