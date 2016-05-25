/** Samples from https://github.com/patriksimek/node-mssql#metadata */

import * as sql from "mssql";

const request = new sql.Request();
request.query('select convert(decimal(18, 4), 1) as first, \'asdf\' as second', function(err, recordset: sql.RecordSet<any>) {
    console.dir(recordset.columns);

    console.log(recordset.columns["first"].type === sql.Decimal); // true
    console.log(recordset.columns["second"].type === sql.VarChar); // true
});
