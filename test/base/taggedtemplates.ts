/** Samples from https://github.com/patriksimek/node-mssql#promises */

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

sql.connect(config).then(function() {
    sql.query`select * from mytable where id = ${value}`.then(function(recordset) {
        console.dir(recordset);
    }).catch(function(err) {
        // ... error checks
    });
}).catch(function(err) {
    // ... error checks
});