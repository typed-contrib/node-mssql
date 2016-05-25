/** Samples from https://github.com/patriksimek/node-mssql#multiple-connections */

import * as sql from "mssql";

const config = {
    user: '...',
    password: '...',
    server: 'localhost', // You can use 'localhost\\instance' to connect to named instance
    database: '...',

    options: {
        encrypt: true // Use this if you're on Windows Azure
    }
};

const value = 50;

new sql.Connection(config).connect().then(function(conn) {
    conn.query`select * from mytable where id = ${value}`.then(function(recordset) {
        console.dir(recordset);
    }).catch(function(err) {
        // ... error checks
    });
}).catch(function(err) {
    // ... error checks
});