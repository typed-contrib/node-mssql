/** Samples from https://github.com/patriksimek/node-mssql#request */

import * as sql from "mssql";

const value = 50;

/** 
 * execute https://github.com/patriksimek/node-mssql#execute-procedure-callback
 */

const request = new sql.Request();
request.input('input_parameter', sql.Int, value);
request.output('output_parameter', sql.Int);
request.execute('procedure_name', function(err, recordsets, returnValue, affected) {
    // ... error checks

    console.log(recordsets.length); // count of recordsets returned by the procedure
    console.log(recordsets[0].length); // count of rows contained in first recordset
    console.log(returnValue); // procedure return value
    console.log(recordsets.returnValue); // same as previous line
    console.log(affected); // number of rows affected by the statemens
    console.log(recordsets.rowsAffected); // same as previous line

    console.log(request.parameters["output_parameter"].value); // output value

    // ...
});

/**
 * input https://github.com/patriksimek/node-mssql#input-name-type-value
 */

request.input('input_parameter', value);
request.input('input_parameter', sql.Int, value);

class MyClass {
    number: number;
}
sql.map.register(MyClass, sql.Text);

sql.map.register(Number, sql.BigInt);

/**
 * output https://github.com/patriksimek/node-mssql#output-name-type-value
 */

request.output('output_parameter', sql.Int);
request.output('output_parameter', sql.VarChar(50), 'abc');

/**
 * pipe https://github.com/patriksimek/node-mssql#pipe-stream
 */

const request1 = new sql.Request();
let stream: NodeJS.WritableStream;
request1.pipe(stream);
request1.query('select * from mytable');
stream.on('error', function(err) {
    // ...
});
stream.on('finish', function() {
    // ...
});

/**
 * query https://github.com/patriksimek/node-mssql#query-command-callback
 */

const request2 = new sql.Request();
request2.query('select 1 as number', function(err, recordset: sql.RecordSet<MyClass>) {
    // ... error checks

    console.log(recordset[0].number); // return 1

    // ...
});

/**
 * batch https://github.com/patriksimek/node-mssql#batch-batch-callback
 */
const request3 = new sql.Request();
request3.batch('create procedure #temporary as select * from table', function(err, recordset) {
    // ... error checks
});

/**
 * bulk https://github.com/patriksimek/node-mssql#bulktable-callback
 */
const table = new sql.Table('table_name'); // or temporary table, e.g. #temptable
table.create = true;
table.columns.add('a', sql.Int, {nullable: true, primary: true});
table.columns.add('b', sql.VarChar(50), {nullable: false});
table.rows.add(777, 'test');

const request4 = new sql.Request();
request4.bulk(table, function(err, rowCount) {
    // ... error checks
});

/**
 * cancel https://github.com/patriksimek/node-mssql#cancel
 */
const request5 = new sql.Request();
request5.query('waitfor delay \'00:00:05\'; select 1 as number', function(err, recordset) {
    console.log(err instanceof sql.RequestError);  // true
    console.log(err.message);                      // Cancelled.
    console.log(err.code);                         // ECANCEL

    // ...
});

request5.cancel();
