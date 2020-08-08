const FS = require('fs');
const Path = require('path');
const Exec = require('child_process').exec;
const QUERIES = require('./queries');
const { PSQL_URL } = require('../configs/server');
const DELIMITERS = require('./data/delimiters');
const AIRPORT_DATA_FILE = './data/airports.tsv';
const TRIP_DATA_FILES = [
    './data/trips/aaa.tsv',
    './data/trips/jsr.tsv',
];

const Log = (message, isError = false) => {
    if (isError) {
        console.error(`[DB SETUP]:`, message)
    }
    else {
        console.log(`[DB SETUP]:`, message);
    }
}


class SetupPSQL {
    constructor() {
        this.Setup = this.Setup.bind(this);
    }

    Setup(cb) {
        Log(`Starting setting up Postgresql for TravelCF...`);

        let commands = `psql ${PSQL_URL}`;

        commands += this._CreateSchema();
        commands += this._SetupTableUsers();
        commands += this._SetupTableAirports();
        commands += this._SetupTableTrips();

        Log(`commands: ${commands}`);

        Exec(commands, (err, stdout, stderr) => {
            if (err) { Log(`Error executing commands ${err}`, true); }
            if (stdout) { Log(`Executing Stdout: ${stdout}`); }
            if (stderr) { Log(`Executing Stderr: ${stderr}`, true); }
            Log(`Finished Setup!`);

            if (cb && typeof cb === 'function') {
                return cb();
            }
        });
    }


    _CreateSchema() {
        const { schema } = QUERIES;
        return ` -c "CREATE SCHEMA IF NOT EXISTS ${schema}"`;
    }


    _SetupTableUsers() {
        const { queryCreate } = QUERIES.tables.users;
        return ` -c "${this._FormatQuery(queryCreate)}"`;      
    }


    _SetupTableAirports() {
        const { table, queryCreate } = QUERIES.tables.airports;
        
        let commands = ` -c "${this._FormatQuery(queryCreate)}"`;
        commands += this._UploadData(table, AIRPORT_DATA_FILE);

        return commands;
    }


    _SetupTableTrips() {
        const { table, queryCreate } = QUERIES.tables.trips;
        
        let commands = ` -c "${this._FormatQuery(queryCreate)}"`;
        
        TRIP_DATA_FILES.map(file => {
            commands += this._UploadData(table, file);
        });

        return commands;
    }


    _UploadData(table, file) {
        file = Path.join(__dirname, file);
        return ` -c "\\COPY ${table} FROM '${file}' delimiter '${DELIMITERS.field}' csv;"`;
    }


    _FormatQuery(query) {
        return query.replace(/\n*\s+/g, ' ');
    }
}


const setup = new SetupPSQL();

setup.Setup();
