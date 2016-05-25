/** Samples from https://github.com/patriksimek/node-mssql#connection */

import * as sql from "mssql";

/**
 * connect https://github.com/patriksimek/node-mssql#connect-callback
 */

const connection = new sql.Connection({
    user: '...',
    password: '...',
    server: 'localhost',
    database: '...'
});

connection.connect(function(err) {
    // ...
});

/**
 * close https://github.com/patriksimek/node-mssql#close
 */

connection.close();

