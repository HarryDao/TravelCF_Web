module.exports = {
    schema: 'air',
    tables: {
        trips: {
            table: 'air.trips',
            queryCreate: `
                CREATE TABLE IF NOT EXISTS air.trips (
                    airline varchar(10) NOT NULL,
                    origin varchar(10) NOT NULL,
                    destination varchar(10) NOT NULL,
                    takeoff bigint NOT NULL,
                    takeoff_local varchar(15) NOT NULL,
                    takeoff_year smallint NOT NULL,
                    takeoff_month smallint NOT NULL,
                    takeoff_date smallint NOT NULL,
                    takeoff_hour smallint NOT NULL,
                    takeoff_minute smallint NOT NULL,
                    landing bigint NOT NULL,
                    landing_local varchar(15) NOT NULL,
                    landing_year smallint NOT NULL,
                    landing_month smallint NOT NULL,
                    landing_date smallint NOT NULL,
                    landing_hour smallint NOT NULL,
                    landing_minute smallint NOT NULL,
                    minutes smallint NOT NULL,
                    price real NOT NULL,
                    PRIMARY KEY (airline, origin, destination, takeoff)
                );
            `,

        },    
        users: {
            table: 'air.users',
            queryCreate: `
                CREATE TABLE IF NOT EXISTS air.users (
                    email varchar(100) NOT NULL UNIQUE PRIMARY KEY,
                    password text NOT NULL,
                    token_id varchar(30) NOT NULL,
                    searches text,
                    activated boolean,
                    key text
                );        
            `,
        },
        airports: {
            table: 'air.airports',
            queryCreate: `
                CREATE TABLE IF NOT EXISTS air.airports (
                    iata varchar(10) NOT NULL UNIQUE PRIMARY KEY,
                    icao varchar(10) NOT NULL,
                    city varchar(100) NOT NULL,
                    airport varchar(200) NOT NULL,
                    country varchar(100) NOT NULL
                );            
            `,
        }
    },
}