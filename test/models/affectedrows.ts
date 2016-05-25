/** Samples from https://github.com/patriksimek/node-mssql#affected-rows */

import * as sql from "mssql";

// With promises
const request = new sql.Request();
request.query('update myAwesomeTable set awesomness = 100').then(function(recordset) {
    request.rowsAffected.toPrecision(2);
    console.log(request.rowsAffected);
});

// With Callback
const request2 = new sql.Request();
request2.query('update myAwesomeTable set awesomness = 100', function(err, recordset, affected) {
    affected.toPrecision(2);
    console.log(affected);
});
