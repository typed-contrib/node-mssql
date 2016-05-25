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

const connection1 = new sql.Connection(config, function(err) {
    // ... error checks

    // Query

    const request = new sql.Request(connection1); // or: var request = connection1.request();
    request.query('select 1 as number', function(err, recordset) {
        // ... error checks

        console.dir(recordset);
    });

});

connection1.on('error', function(err) {
    // ... error handler
});

const connection2 = new sql.Connection(config, function(err) {
    // ... error checks

    // Stored Procedure

    const request = connection2.request();
    request.input('input_parameter', sql.Int, 10);
    request.output('output_parameter', sql.VarChar(50));
    request.execute('procedure_name', function(err, recordsets, returnValue) {
        // ... error checks

        console.dir(recordsets);
    });
});

connection2.on('error', function(err) {
    // ... error handler
});