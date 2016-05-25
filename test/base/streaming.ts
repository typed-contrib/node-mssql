/** Samples from https://github.com/patriksimek/node-mssql#streaming */

import * as sql from "mssql";

const config = {
    user: '...',
    password: '...',
    server: 'localhost', // You can use 'localhost\\instance' to connect to named instance
    database: '...',
    stream: true, // You can enable streaming globally

    options: {
        encrypt: true // Use this if you're on Windows Azure
    }
};

sql.connect(config, function(err) {
    // ... error checks

    var request = new sql.Request();
    request.stream = true; // You can set streaming differently for each request
    request.query('select * from verylargetable'); // or request.execute(procedure);

    request.on('recordset', function(columns) {
        // Emitted once for each recordset in a query
    });

    request.on('row', function(row) {
        // Emitted for each row in a recordset
    });

    request.on('error', function(err) {
        // May be emitted multiple times
    });

    request.on('done', function(affected) {
        // Always emitted as the last one
    });
});

sql.on('error', function(err) {
    // ... error handler
});