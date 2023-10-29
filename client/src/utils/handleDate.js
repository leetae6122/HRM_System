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

const countDaysInMonth = () => {
  const now = dayjs();
  const days = dayjs(now).daysInMonth();
  const currentMonth = dayjs(now).month() + 1;
  const currentYear = dayjs(now).year();
  let countDays = 0;

  for (let i = 1; i <= days; i++) {
    const day = dayjs(`${currentYear}-${currentMonth}-${i}`).day();
    if (day !== 0 && day !== 6) {
      countDays++;
    }
  }
  return countDays;
};

const getMonthName = (date) => {
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

export { getFullDate, calcDate, countDaysInMonth, getMonthName };