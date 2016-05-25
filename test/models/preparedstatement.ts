/** Samples from https://github.com/patriksimek/node-mssql#prepared-statement */

import * as sql from "mssql";

class MyClass {
    value: string;
}

/**
 * Basic
 */

const ps = new sql.PreparedStatement(/* [connection] */);
ps.input('param', sql.Int);
ps.prepare('select @param as value', function(err) {
    // ... error checks

    ps.execute({param: 12345}, function(err, recordset) {
        // ... error checks

        ps.unprepare(function(err) {
            // ... error checks

        });
    });
});

/**
 * input https://github.com/patriksimek/node-mssql#input-name-type
 */

ps.input('input_parameter', sql.Int);
ps.input('input_parameter', sql.VarChar(50));

/**
 * output https://github.com/patriksimek/node-mssql#output-name-type
 */

ps.output('output_parameter', sql.Int);
ps.output('output_parameter', sql.VarChar(50));

/**
 * prepare https://github.com/patriksimek/node-mssql#prepare-statement-callback
 */

const ps2 = new sql.PreparedStatement();
ps2.prepare('select @param as value', function(err) {
    // ... error checks
});

/**
 * execute https://github.com/patriksimek/node-mssql#execute-values-callback
 */

// Basic
const ps3 = new sql.PreparedStatement();
ps3.input('param', sql.Int);
ps3.prepare('select @param as value', function(err) {
    // ... error checks

    ps3.execute({param: 12345}, function(err, recordset: sql.RecordSet<MyClass>, affected) {
        // ... error checks

        console.log(recordset[0].value); // return 12345
        console.log(affected); // Returns number of affected rows in case of INSERT, UPDATE or DELETE statement.

        ps3.unprepare(function(err) {
            // ... error checks
        });
    });
});

// Multi
const ps4 = new sql.PreparedStatement();
ps4.input('param', sql.Int);
ps4.prepare('select @param as value', function(err) {
    // ... error checks

    ps4.multiple = true;
    ps4.execute<MyClass>({param: 12345}, function(err, recordsets: sql.RecordSets<MyClass>, affected) {
        // ... error checks

        console.log(recordsets[0][0].value); // return 12345
        console.log(affected); // Returns number of affected rows in case of INSERT, UPDATE or DELETE statement.

        ps4.unprepare(function(err) {
            // ... error checks
        });
    });
});

// Stream
const ps5 = new sql.PreparedStatement();
ps5.input('param', sql.Int);
ps5.prepare('select @param as value', function(err) {
    // ... error checks

    ps5.stream = true;
    const request = ps5.execute({param: 12345}, function(err) {
        ps5.unprepare(function(err) {
            // ... error checks
        });
    });

    request.on('recordset', function(columns) {
        // Emitted once for each recordset in a query
    });

    request.on('row', function(row) {
        // Emitted for each row in a recordset
    });

    request.on('error', function(err) {
        // May be emitted multiple times
    });

    request.on('done', function(returnValue, affected) {
        // Always emitted as the last one

        console.log(affected); // Returns number of affected rows in case of INSERT, UPDATE or DELETE statement.
    });
});

/**
 * unprepare https://github.com/patriksimek/node-mssql#unprepare-callback
 */

const ps6 = new sql.PreparedStatement();
ps6.input('param', sql.Int);
ps6.prepare('select @param as value', function(err) {
    // ... error checks

    ps6.unprepare(function(err) {
        // ... error checks

    });
});
