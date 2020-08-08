const Url = require('url');
const { Pool, Client } = require('pg');

const { PSQL_URL } = require('../../configs/server');

module.exports = class Postgres {
    constructor() {
        this.CreateClient = this.CreateClient.bind(this);
        this.Query = this.Query.bind(this);
        this.QuickQuery = this.QuickQuery.bind(this);
        this.QuickQueryWithCB = this.QuickQueryWithCB.bind(this);
        this.CloseClient = this.CloseClient.bind(this);

        this.pool = this.Connect();
    }

    Connect() {
        try {
            let {
                auth,
                hostname,
                port,
                pathname,
            } = Url.parse(`${PSQL_URL}`);
    
            auth = auth.split(':');
    
            const configs = {
                user: auth[0],
                password: auth[1],
                host: hostname,
                port,
                database: pathname.replace(/\//g, ''),
                // ssl: true,
                max: 20,
                min: 10,
                idleTimeoutMillis: 20000,
                connectionTimeoutMillis: 20000,
            }
    
            return new Pool(configs);
        }
        catch(err){
            throw `Connect - ${err}`;
        }
    }

    CreateClient() {
        return new Promise((resolve, reject) => {
            this.pool.connect((err, client) => {
                if (err){ reject(`Create Client - ${err}`); }
                resolve(client);
            });
        });
    }

    Query(client, query, args = []) {
        return new Promise((resolve) => {
            client.query(query, args, (err, res) => {

                const { rows, rowCount } = this._ReadResponse(res);

                resolve({ err, rows, rowCount });
            });
        });
    }

    CloseClient(client) {
        try {
            client.release();
        }
        catch(err){
            throw `Close Client - ${err}`;
        }
    }

    QuickQuery(query, args=[]) {
        return new Promise((resolve, reject) => {
            this.pool.connect((err, client) => {
                if (err) {resolve({ err })}
                client.query(query, args, (err, res) => {
                    client.release();

                    const { rows, rowCount } = this._ReadResponse(res);
                    resolve({ err, rows, rowCount });
                });
            });
        });
    }

    QuickQueryWithCB(query, args = [], cb) {
        this.pool.connect((err, client) => {
            if (err){ return cb({ err }); }

            client.query(query, args, (err, res) => {
                client.release();

                const { rows, rowCount } = this._ReadResponse(res);
                return cb({ err, rows, rowCount });
            }); 
        });
    }

    _ReadResponse(res) {
        let rows = null;
        let rowCount = 0;

        if (res && res.rows) {
            rows = res.rows;
        }

        if (res && res.rowCount) {
            rowCount = res.rowCount;
        }

        return { rows, rowCount };
    }
}