const getFullDate = (date) => {
    const dateAndTime = date.split('T');

    return dateAndTime[0].split('-').reverse().join('-');
};

export { getFullDate };