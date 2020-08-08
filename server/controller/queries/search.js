const moment = require('moment');
const {
    tables: {
        trips: { table: TABLE_TRIPS },
        airports: { table: TABLE_AIRPORTS }
    }
} = require('../../../db/queries');

exports.findAirportsByCodes = ({ codes }) => {
    return `
        SELECT * FROM ${TABLE_AIRPORTS}
        WHERE iata IN ('${codes}');
    `;
}

exports.findOriginAirports = () => {
    return `
        SELECT * FROM ${TABLE_AIRPORTS}
        WHERE iata in (
            SELECT DISTINCT(origin) FROM ${TABLE_TRIPS}
        );    
    `;
}

exports.findDestinationAirports = ({ origin }) => {
    return `
        SELECT * FROM ${TABLE_AIRPORTS}
        WHERE iata in (
            SELECT DISTINCT(destination) FROM ${TABLE_TRIPS}
            WHERE origin='${origin}'
        );
    `;
}

exports.findAvailableDates = ({ origin, destination, min }) => {
    let maxTime = moment().startOf('day')
        .add(6, 'month')
        .valueOf();

    let query =  `
        SELECT DISTINCT takeoff_year, takeoff_month, takeoff_date
        FROM ${TABLE_TRIPS}
        WHERE origin='${origin}' AND destination='${destination}' AND takeoff < ${maxTime}
    `;

    if (min) {
        query += ` AND takeoff >= ${min}`;
    }

    return query;
}

exports.findTrips = ({ origin, destination, year, month, date }) => {
    return `
        SELECT 
            airline,
            origin,
            destination,
            takeoff,
            takeoff_local,
            landing,
            landing_local,
            minutes,
            price,
            (SELECT city FROM ${TABLE_AIRPORTS} WHERE iata = '${origin}') AS origin_city,
            (SELECT city FROM ${TABLE_AIRPORTS} WHERE iata = '${destination}') AS destination_city
        FROM ${TABLE_TRIPS}
        WHERE
            origin='${origin}' AND
            destination='${destination}' AND
            takeoff_year='${year}' AND
            takeoff_month='${month}' AND
            takeoff_date='${date}'
        ORDER BY takeoff;
    `;
}