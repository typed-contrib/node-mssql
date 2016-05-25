/** Samples from https://github.com/patriksimek/node-mssql#nested-callbacks */

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

sql.connect(config, function(err) {
    // ... error checks

    // Query

    new sql.Request().query('select 1 as number', function(err, recordset) {
        // ... error checks

        console.dir(recordset);
    });

    // Stored Procedure

    new sql.Request()
    .input('input_parameter', sql.Int, value)
    .output('output_parameter', sql.VarChar(50))
    .execute('procedure_name', function(err, recordsets, returnValue) {
        // ... error checks

        console.dir(recordsets);
    });
});

sql.on('error', function(err) {
    // ... error handler
});