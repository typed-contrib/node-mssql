/** Samples from https://github.com/patriksimek/node-mssql#transaction */

import * as sql from "mssql";

/**
 * Basic
 */

const transaction = new sql.Transaction(/* [connection] */);
transaction.begin(function(err) {
    // ... error checks

    var request = new sql.Request(transaction);
    request.query('insert into mytable (mycolumn) values (12345)', function(err, recordset) {
        // ... error checks

        transaction.commit(function(err) {
            // ... error checks

            console.log("Transaction committed.");
        });
    });
});

/**
 * Aborted transactions
 */
const transaction2 = new sql.Transaction(/* [connection] */);
transaction2.begin(function(err) {
    // ... error checks

    let rolledBack = false;

    transaction2.on('rollback', function(aborted) {
        // emited with aborted === true

        rolledBack = true;
    });

    const request = new sql.Request(transaction2);
    request.query('insert into mytable (bitcolumn) values (2)', function(err, recordset) {
        // insert should fail because of invalid value

        if (err) {
            if (!rolledBack) {
                transaction2.rollback(function(err) {
                    // ... error checks
                });
            }
        } else {
            transaction2.commit(function(err) {
                // ... error checks
            });
        }
    });
});

/**
 * begin https://github.com/patriksimek/node-mssql#begin-isolationlevel-callback
 */

const transaction3 = new sql.Transaction();
transaction3.begin(function(err) {
    // ... error checks
});

/**
 * commit https://github.com/patriksimek/node-mssql#commit-callback
 */

const transaction4 = new sql.Transaction();
transaction4.begin(function(err) {
    // ... error checks

    transaction4.commit(function(err) {
        // ... error checks
    })
});

/**
 * rollback https://github.com/patriksimek/node-mssql#rollback-callback
 */

var transaction5 = new sql.Transaction();
transaction5.begin(function(err) {
    // ... error checks

    transaction5.rollback(function(err) {
        // ... error checks
    })
});