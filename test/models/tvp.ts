/** Samples from https://github.com/patriksimek/node-mssql#table-valued-parameter-tvp */

import * as sql from "mssql";

const tvp = new sql.Table()

// Columns must correspond with type we have created in database.
tvp.columns.add('a', sql.VarChar(50));
tvp.columns.add('b', sql.Int);

// Add rows
tvp.rows.add('hello tvp', 777); // Values are in same order as columns.

// You can send table as a parameter to stored procedure.
const request = new sql.Request();
request.input('tvp', tvp);
request.execute('MyCustomStoredProcedure', function(err, recordsets, returnValue) {
    // ... error checks

    console.dir(recordsets[0][0]); // {a: 'hello tvp', b: 777}
});