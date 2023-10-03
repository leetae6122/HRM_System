import dayjs from "dayjs";
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration)

const getFullDate = (date) => {
    const dateAndTime = date.split('T');

    return dateAndTime[0].split('-').reverse().join('-');
};

const calcDate = (d1, d2) => {
    const date1 = dayjs(d1)
    const date2 = dayjs(d2)
    const duration = dayjs.duration(date2.diff(date1));

    const days = duration.$d.days;
    const months = duration.$d.months;
    const years = duration.$d.years;

    let message = years + (years > 1 ? " years, " : " year, ");
    message += months + (months > 1 ? " months, " : " month, ")
    message += days + " days"

    return message;
}

export { getFullDate, calcDate };