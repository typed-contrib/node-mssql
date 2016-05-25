/** Samples from https://github.com/patriksimek/node-mssql#data-types */

import * as sql from "mssql";

const request = new sql.Request();

request.input("name", sql.VarChar, "abc");               // varchar(3)
request.input("name", sql.VarChar(50), "abc");           // varchar(50)
request.input("name", sql.VarChar(sql.MAX), "abc");      // varchar(MAX)
request.output("name", sql.VarChar);                     // varchar(8000)
request.output("name", sql.VarChar, "abc");              // varchar(3)

request.input("name", sql.Decimal, 155.33);              // decimal(18, 0)
request.input("name", sql.Decimal(10), 155.33);          // decimal(10, 0)
request.input("name", sql.Decimal(10, 2), 155.33);       // decimal(10, 2)

request.input("name", sql.DateTime2, new Date());        // datetime2(7)
request.input("name", sql.DateTime2(5), new Date());     // datetime2(5)
