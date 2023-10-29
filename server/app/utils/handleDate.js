import dayjs from "dayjs";

export const getMonthName = (date) => {
    const monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];
    const thisMonth = dayjs(date).month();
    const thisYear = dayjs(date).year();
    return `${monthNames[thisMonth]} ${thisYear}`
}