import _ from 'lodash';

export const DAY_NAMES = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
];


export const MONTH_NAMES = [
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
    'December'
];


export const DefaultCalendar = (() => {
    const ONE_DAY = 24 * 60 * 60 * 1000;

    const now = new Date();
    const currentMonth = now.getUTCMonth();
    const currentYear = now.getUTCFullYear();
     
    const start = Date.UTC(currentYear, currentMonth, 1, 0, 0, 0);
    const end = Date.UTC(currentYear + 1, currentMonth, 0, 0, 0, 0);
    
    const output = {};
    for (let time = start; time <= end; time += ONE_DAY ) {
        let newTime = new Date(time);
        let day = newTime.getUTCDay();
        let date = newTime.getUTCDate();
        let month = newTime.getUTCMonth() + 1;
        let year = newTime.getUTCFullYear();

        if (!output[year]) {
            output[year] = {};
        }

        if (!output[year][month]) {
            output[year][month] = {};
        }

        output[year][month][date] = {
            day, 
            date, 
            month, 
            year, 
            time, 
            available: {}
        };
    }

    return output;
})();


export const updateCalendarOnNewProps = (next, current) => {
    const {
        departDateOptions,
        returnDateOptions,
        departDate,
        returnDate,
    } = next;

    const notUpdate = 
        JSON.stringify(departDateOptions) === JSON.stringify(current.departDateOptions) &&
        JSON.stringify(returnDateOptions) === JSON.stringify(current.returnDateOptions) &&
        JSON.stringify(departDate) === JSON.stringify(current.departDate) &&
        JSON.stringify(returnDate) === JSON.stringify(current.returnDate);

    if (notUpdate) {
        return null;
    }

    const departDateTime = departDate ? Date.UTC(departDate.year, departDate.month - 1, departDate.date, 0, 0, 0) : null;
    const returnDateTime = returnDate ? Date.UTC(returnDate.year, returnDate.month - 1, returnDate.date, 0, 0, 0) : null;

    const calendar = JSON.parse(JSON.stringify(DefaultCalendar));

    for (let year in calendar) {
        for (let month in calendar[year]) {
            for (let date in calendar[year][month]) {
                let target = calendar[year][month][date];
                let { time } = target;

                
                if (departDateOptions[time]) {
                    target.available.departDate = true;
                }

                if (returnDateOptions[time]) {
                    target.available.returnDate = true;
                }

                if (
                    departDateTime && 
                    departDateTime == time && 
                    target.available.departDate
                ) {
                    target.departDate = true;
                }

                if (
                    returnDateTime && 
                    returnDateTime == time && 
                    target.available.returnDate
                ) {
                    target.returnDate = true;
                }

                if (
                    departDateTime && 
                    returnDateTime && 
                    departDateTime < time && 
                    time < returnDateTime
                ) {
                    target.stayDate = true;
                }
            }
        }
    }

    return calendar;
}


export const composeDateText = (year, month, date) => {
    if (month < 10) {
        month = `0${month}`;
    }
    if (date < 10) {
        date = `0${date}`;
    }

    return `${date}/${month}/${year}`;
}


export const getDateInfo = (time) => {
    try {
        
        const year = time.getUTCFullYear();
        const month = time.getUTCMonth() + 1;
        const date = time.getUTCDate();
        const day = time.getUTCDay();
    
        return {
            year,
            month,
            monthString: MONTH_NAMES[month - 1],
            date,
            day,
            dayString: DAY_NAMES[day],
            time: time.getTime(),
        }
    }
    catch(err) {
        return {};
    }
}


export const Today = (() => {
    const now = new Date();
    return {
        ...getDateInfo(now),
        now
    };
})();


export const rearrangeMonthIntoWeeks = (dates) => {
    const weeks = [];
    
    dates = _.map(dates, date => {
        return date;
    });

    for (let w = 1; w <= 6; w ++) {
        let week = [];
        let validWeek = false;
        for (let d = 0; d <= 6; d ++) {
            if (dates.length > 0 && d === dates[0].day) {
                validWeek = true;
                week.push(dates.shift());
            }
            else {
                week.push({
                    day: d,
                    date: null
                });
            }
        }

        if (validWeek) {
            weeks.push(week);
        }
    }

    return weeks
}


export const convertMinutesToHours = (minutes) => {
    try {
        const newMinutes = minutes % 60;
        const newHours = (minutes - newMinutes) / 60;

        let stringHours, stringMinutes;

        switch(newHours) {
            case 0:
                stringHours = '';
                break;
            case 1:
                stringHours = '1hr ';
                break;
            default:
                stringHours = `${newHours}hrs `;
        }

        switch(newMinutes) {
            case 0:
                stringMinutes = '';
                break;
            case 1:
                stringMinutes = '1min';
                break;
            default:
                stringMinutes = `${newMinutes}mins`;
        }

        return {
            minutes: newMinutes,
            hours: newHours,
            timeString: `${stringHours}${stringMinutes}`
        }
    }
    catch(err) {
        return minutes;
    }
}