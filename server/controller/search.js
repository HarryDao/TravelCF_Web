const _ = require('lodash');
const PG = require('./');
const { mapArrayToObject, composeDate } = require('../helpers');
const SearchQueries = require('./queries/search');

class SearchController extends PG {
    constructor(){
        super();

        this.GetCityDescription = this.GetCityDescription.bind(this);
        this.GetOriginAirports = this.GetOriginAirports.bind(this);
        this.GetDestinationAirports = this.GetDestinationAirports.bind(this);
        this.GetAvailableDates = this.GetAvailableDates.bind(this);
        this.GetTrips = this.GetTrips.bind(this);
    }

    GetCityDescription(codes, cb) {
        if (!codes || codes.length === 0) {
            return cb([]);
        }

        this.QuickQueryWithCB(
            SearchQueries.findAirportsByCodes({
                codes: codes.join("', '")
            }), 
            [], 
            ({ err, rows }) => {
                if (rows) {
                    rows = rows.reduce((obj, value) => {
                        const { iata, city, country } = value;

                        obj[iata] = { iata, city, country };
                        return obj;
                    }, {});
                }

                return cb(err, rows);
            }
        );
    }

    GetOriginAirports(cb) {        
        this.QuickQueryWithCB(
            SearchQueries.findOriginAirports(), 
            [], 
            ({ err, rows }) => {
                rows = mapArrayToObject(rows, 'iata', 'city');
                return cb(err, rows);
            }
        );
    }

    GetDestinationAirports({ origin }, cb) {
        if (!origin || typeof origin !== 'string') {
            return cb({ code: 403, message: `Invalid Input` });
        }

        this.QuickQueryWithCB(
            SearchQueries.findDestinationAirports({ origin }), 
            [], 
            ({ err, rows }) => {
                rows = mapArrayToObject(rows, 'iata', 'city');
                return cb(err, rows);
            }
        );
    }

    GetAvailableDates({ origin, destination, min }, cb) {
        if (!origin || 
            !destination || 
            typeof origin !== 'string' || 
            typeof destination !== 'string'
        ) {
            return cb({ code: 403, message: `Invalid Input` });
        }

        this.QuickQueryWithCB(
            SearchQueries.findAvailableDates({
                origin,
                destination,
                min: min ? composeDate(min.year, min.month || null, min.date || null).number : null
            }), 
            [], 
            ({ err, rows }) => {
                const output = {};
                rows.map(row => {
                    const { takeoff_year, takeoff_month, takeoff_date } = row;
                    const time = Date.UTC(takeoff_year, takeoff_month - 1, takeoff_date, 0, 0, 0);

                    output[time] = {
                        year: takeoff_year,
                        month: takeoff_month,
                        date: takeoff_date,
                    }
                });
                return cb(err, output);
            }
        );
    }

    GetTrips({ origin, destination, time }, cb) {
        const { year, month, date } = time;

        this.QuickQueryWithCB(
            SearchQueries.findTrips({
                origin,
                destination,
                year,
                month,
                date
            }), 
            [], 
            ({ err, rows }) => {
                if (rows) {
                    rows = rows.map(row => {
                        row.takeoff_local = row.takeoff_local.replace('(+0)', '');
                        row.landing_local = row.landing_local.replace('(+0)', '');
                        return row;
                    });
                }
                return cb(err, rows)
            }
        );
    }
}


module.exports = new SearchController();