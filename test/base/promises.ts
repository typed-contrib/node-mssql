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

sql.connect(config)
    .then(function() {
        const value = 50;
        
        // Query

        new sql.Request()
            .input('input_parameter', sql.Int, value)
            .query('select * from mytable where id = @input_parameter').then(function(recordset) {
                console.dir(recordset);
            }).catch(function(err) {
                // ... error checks
            });

        // Stored Procedure

        new sql.Request()
            .input('input_parameter', sql.Int, value)
            .output('output_parameter', sql.VarChar(50))
            .execute('procedure_name')
            .then(function(recordsets) {
                console.dir(recordsets);
            })
            .catch(function(err) {
                // ... error checks
            });
    })
    .catch(function(err) {
        // ... error checks
    });