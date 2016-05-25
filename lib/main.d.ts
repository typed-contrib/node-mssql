// Type definitions for node-mssql v3
// Project: https://github.com/patriksimek/node-mssql
// Definitions by: Maxime LUCE <https://github.com/SomaticIT/>
// Definitions: https://github.com/typed-contrib/node-mssql

import { EventEmitter } from "events";
import { TYPES, DataType, DataTypeFunction, PrecisionedDataType, ScaledDataType, SizedDataType } from "./datatypes";
import { RecordSet, RecordSets } from "./table";

export const map: SqlTypeMap;

/** 
 * Class Connection.
 * 
 * Internally, each `Connection` instance is a separate pool of TDS connections. 
 * Once you create a new `Request`/`Transaction`/`Prepared Statement`, a new TDS connection is acquired from the pool and reserved for desired action. 
 * Once the action is complete, connection is released back to the pool.
 * 
 * @fires Connection#connect
 * @fires Connection#close
 * @fires Connection#error
 */
export class Connection extends EventEmitter {
    /** If true, connection is established. */
    connected: boolean;
    /** If true, connection is being established. */
    connecting: boolean;
    /** Reference to configured Driver. */
    driver: any;
    /** Connection configuration object. */
    config: Configuration;

    /**
     * @constructor
     * Create new Connection.
     * 
     * @param       config          Connection configuration object or connection string.
     * @param       [callback]      A callback which is called after connection has established, or an error has occurred.
     * @throws {ConnectionError}    Unknown driver.
     */
    constructor(config: string | Configuration, callback?: ErrorCallback<ConnectionError>);

    /** Create connection to the server. */
    connect(): Promise<this>;
    /**
     * Create connection to the server.
     * 
     * @param       callback        A callback which is called after connection has established, or an error has occurred.
     * @returns                     The Connection instance.
     */
    connect(callback: ErrorCallback<ConnectionError>): this;

    /** Close all active connections in the pool. */
    close(): Promise<void>;
    /** 
     * Close all active connections in the pool.
     * 
     * @param       callback        A callback which is called after connection has closed, or an error has occurred.
     * @returns                     The Connection instance.
     */
    close(callback: ErrorCallback<ConnectionError>): this;

    /** Returns new request using this connection. */
    request(): Request;

    /** Returns new transaction using this connection. */
    transaction(): Transaction;

    /**
     * Creates a new query using this connection from a tagged template string.
     * 
     * @param       strings         Array of string literals.
     * @param       values          Values.
     * @returns                     The Query Request.
     */
    query<T>(strings: string[], ...values: any[]): Promise<RecordSet<T>>;

    /**
     * Creates a new batch using this connection from a tagged template string.
     * 
     * @param       strings         Array of string literals.
     * @param       values          Values.
     * @returns                     The Batch Request.
     */
    batch<T>(strings: string[], ...values: any[]): Promise<RecordSet<T>>;
}

/**
 * Class PreparedStatement.
 * 
 * IMPORTANT: Rememeber that each prepared statement means one reserved connection from the pool. Don't forget to unprepare a prepared statement!
 */
export class PreparedStatement extends EventEmitter {
    /** Reference to used connection. */
    connection: Connection;
    /** If `true`, `execute` will handle multiple recordsets. */
    multiple: boolean;
    /** Prepared SQL statement. */
    statement: string;
    /** References instance of most recent Request created by executing a statement. */
    lastRequest: Request;
    /** `true` if request is in streaming-mode. */
    stream: boolean;

    /** Create new Prepared Statement using global connection. */
    constructor();
    /** Create new Prepared Statement using given connection. */
    constructor(connection: Connection);

    /**
     * Add an input parameter to the prepared statement.
     * 
     * @param       name            Name of the input parameter without @ char.
     * @param       type            SQL data type of input parameter.
     */
    input(name: string, type: DataType): this;

    /**
     * Add an output parameter to the prepared statement.
     * 
     * @param       name            Name of the output parameter without @ char.
     * @param       type            SQL data type of output parameter.
     */
    output(name: string, type: DataType): this;

    /**
     * Prepare a statement.
     * 
     * @param       statement       T-SQL statement to prepare.
     */
    prepare(statement: string): Promise<this>;
    /**
     * Prepare a statement.
     * 
     * @param       statement       T-SQL statement to prepare.
     * @param       callback        A callback which is called after preparation has completed, or an error has occurred.
     */
    prepare(statement: string, callback: ErrorCallback<PreparedStatementError | TransactionError | RequestError | ConnectionError>): this;


    /** Unprepare a prepared statement. */
    unprepare(): Promise<void>;
    /**
     * Unprepare a prepared statement.
     * 
     * @param       callback        A callback which is called after unpreparation has completed, or an error has occurred.
     */
    unprepare(callback: ErrorCallback<RequestError | ConnectionError>): this;

    /**
     * Execute the SQL command. To execute commands like `create procedure` or if you plan to work with local temporary tables, use batch instead.
     * 
     * @param       values          An object whose names correspond to the names of parameters that were added to the prepared statement before it was prepared.
     */
    execute<T>(values: any): Promise<RecordSets<T>>;
    /**
     * Execute the SQL command. To execute commands like `create procedure` or if you plan to work with local temporary tables, use batch instead.
     * 
     * @param       values          An object whose names correspond to the names of parameters that were added to the prepared statement before it was prepared.
     * @param       callback        A callback which is called after execution has completed, or an error has occurred.
     */
    execute<T>(values: any, callback: (err: ConnectionError, recordset: RecordSet<T> | RecordSets<T>, rowsAffected: number) => void): Request;
}

/**
 * Class Transaction.
 * 
 * IMPORTANT: always use `Transaction` class to create transactions.
 * It ensures that all your requests are executed on one connection.
 * Once you call  begin , a single connection is acquired from the connection pool and all subsequent requests (initialized with the  Transaction  object) are executed exclusively on this connection. 
 * Transaction also contains a queue to make sure your requests are executed in series. After you call  commit  or  rollback , connection is then released back to the connection pool.
 * 
 * @fires       Transaction#begin       Dispatched when transaction begin. 
 * @fires       Transaction#commit      Dispatched on successful commit. 
 * @fires       Transaction#rollback    Dispatched on successful rollback. 
 */
export class Transaction extends EventEmitter {
    /** Reference to used connection. */
    connection: Connection;
    /** Controls the locking and row versioning behavior of TSQL statements issued by a connection. READ_COMMITTED by default. */
    isolationLevel: number;
    /** Transaction name. Empty string by default. */
    name: string;

    /** Create new Transaction using global Connection. */
    constructor();
    /** Create new Transaction using specified connection. */
    constructor(connection: Connection);

    /** Begin a transaction. */
    begin(): Promise<this>;
    /**
     * Begin a transaction.
     * 
     * @param       isolationLevel      Controls the locking and row versioning behavior of TSQL statements issued by a connection.
     */
    begin(isolationLevel: ISOLATION_LEVEL): Promise<this>;
    /**
     * Begin a transaction.
     * 
     * @param       isolationLevel      Controls the locking and row versioning behavior of TSQL statements issued by a connection.
     * @param       callback            A callback which is called after transaction has began, or an error has occurred.
     */
    begin(callback: ErrorCallback<TransactionError | ConnectionError>): this;
    /**
     * Begin a transaction.
     * 
     * @param       isolationLevel      Controls the locking and row versioning behavior of TSQL statements issued by a connection.
     * @param       callback            A callback which is called after transaction has began, or an error has occurred.
     */
    begin(isolationLevel: ISOLATION_LEVEL, callback: ErrorCallback<TransactionError | ConnectionError>): this;


    /** Commit a transaction. */
    commit(): Promise<void>;
    /**
     * Commit a transaction.
     * @param       callback            A callback which is called after transaction has committed, or an error has occurred.
     */
    commit(callback: ErrorCallback<TransactionError | ConnectionError>): this;

    /** 
     * Rollback a transaction. 
     * If the queue isn't empty, all queued requests will be canceled and the transaction will be marked as aborted.
     */
    rollback(): Promise<void>;
    /**
     * Rollback a transaction. 
     * If the queue isn't empty, all queued requests will be canceled and the transaction will be marked as aborted.
     * 
     * @param       callback            A callback which is called after transaction has rolled back, or an error has occurred.
     */
    rollback(callback: ErrorCallback<TransactionError | ConnectionError>): this;

    /** Creates a new Request using this transaction. */
    request(): Request;
}

/** 
 * Class Request.
 * 
 * @fires       Request#recordset       Dispatched when metadata for new recordset are parsed.
 * @fires       Request#row             Dispatched when new row is parsed.
 * @fires       Request#done            Dispatched when request is complete.
 * @fires       Request#error           Dispatched on error.
 */
export class Request extends EventEmitter {
    /** Reference to used connection. */
    connection: Connection;
    /** Reference to transaction when request was created in transaction. */
    tranaction: Transaction;
    /** Collection of input and output parameters. */
    parameters: { [key: string]: RequestParameter<any> };
    /** If `true`, `query` will handle multiple recordsets (`execute` always expect multiple recordsets). */
    multiple: boolean;
    /** If `true`, debug messages are printed to message log. */
    verbose: boolean;
    /** `true` if request was canceled. */
    canceled: boolean;
    /** `true` if request is in streaming-mode. */
    stream: boolean;
    /** If you're performing INSERT, UPDATE or DELETE in a query, you can read number of affected rows. */
    rowsAffected: number;
    
    /** Create new Request using global Connection. */
    constructor();
    /** Create new Request using specified connection or transaction. */
    constructor(connectionOrTransaction: Connection | Transaction);

    /**
     * Add an input parameter to the request.
     * 
     * @param       name            Name of the input parameter without @ char.
     * @param       type            SQL data type of input parameter.
     * @param       value           Input parameter value. `undefined` and `NaN` values are automatically converted to `null` values.
     */
    input<T>(name: string, type: DataType, value: T): this;
    /**
     * Add an input parameter to the request.
     * Module automaticaly decide which SQL data type should be used based on JS data type.
     * 
     * @param       name            Name of the input parameter without @ char.
     * @param       value           Input parameter value. `undefined` and `NaN` values are automatically converted to `null` values.
     */
    input<T>(name: string, value: T): this;

    /**
     * Add an output parameter to the request.
     * 
     * @param       name            Name of the output  parameter without @ char.
     * @param       type            SQL data type of output  parameter.
     */
    output(name: string, type: DataType): this;
    /**
     * Add an output parameter to the request.
     * 
     * @param       name            Name of the output parameter without @ char.
     * @param       type            SQL data type of output  parameter.
     * @param       value           Output parameter value. `undefined` and `NaN` values are automatically converted to `null` values.
     */
    output<T>(name: string, type: DataType, value: T): this;

    /**
     * Execute the SQL command.
     * 
     * Unlike query, it doesn't use `sp_executesql`, so is not likely that SQL Server will reuse the execution plan it generates for the SQL.
     * Use this only in special cases, for example when you need to execute commands like `create procedure` which can't be executed with query or if you're executing statements longer than 4000 chars on SQL Server 2000.
     * Also you should use this if you're plan to work with local temporary tables (more information here).
     * NOTE: Table-Valued Parameter (TVP) is not supported in batch.
     * 
     * @param batch - T-SQL command to be executed.
     */
    batch<T>(batch: string): Promise<RecordSets<T>>;
    /**
     * Execute the SQL command.
     * 
     * Unlike query, it doesn't use `sp_executesql`, so is not likely that SQL Server will reuse the execution plan it generates for the SQL.
     * Use this only in special cases, for example when you need to execute commands like `create procedure` which can't be executed with query or if you're executing statements longer than 4000 chars on SQL Server 2000.
     * Also you should use this if you're plan to work with local temporary tables (more information here).
     * NOTE: Table-Valued Parameter (TVP) is not supported in batch.
     * 
     * @param batch - T-SQL command to be executed.
     * @param callback - A callback which is called after execution has completed, or an error has occurred.
     */
    batch<T>(batch: string, callback: (err: ConnectionError | RequestError | TransactionError, recordset: RecordSets<T>, rowsAffected: number) => void): this;

    /**
     * Perform a bulk insert.
     * 
     * @param       table           `sql.Table` instance.
     */
    bulk<T>(table: Table): Promise<RecordSet<T>>;
    /**
     * Perform a bulk insert.
     * 
     * @param       table           `sql.Table` instance.
     * @param       callback         A callback which is called after bulk insert has completed, or an error has occurred.
     */
    bulk<T>(table: Table, callback: (err: ConnectionError | RequestError | TransactionError, rowCount: number) => void): this;

    /**
     * Sets request to `stream` mode and pulls all rows from all recordsets to a given stream.
     * 
     * @param       stream          Writable stream in object mode.
     */
    pipe(stream: NodeJS.WritableStream): typeof stream;

    /**
     * Execute the SQL command. 
     * To execute commands like `create procedure` or if you plan to work with local temporary tables, use batch instead.
     * 
     * @param       command         T-SQL command to be executed.
     */
    query<T>(command: string): Promise<RecordSet<T>>;
    /**
     * Execute the SQL command. To execute commands like `create procedure` or if you plan to work with local temporary tables, use batch instead.
     * @param       command         T-SQL command to be executed.
     * @param       callback        A callback which is called after execution has completed, or an error has occurred.
     */
    query<T>(command: string, callback: (err: ConnectionError | RequestError | TransactionError, recordset: RecordSet<T> | RecordSets<T>, rowsAffected: number) => void): this;

    /**
     * Call a stored procedure.
     * 
     * @param       procedure       Name of the stored procedure to be executed.
     */
    execute<T>(procedure: string): Promise<RecordSets<T>>;
    /**
     * Call a stored procedure.
     * 
     * @param       procedure       Name of the stored procedure to be executed.
     * @param       callback        A callback which is called after execution has completed, or an error has occurred. 'returnValue' is also accessible as property of recordsets. 
     */
    execute<T>(procedure: string, callback: (err: ConnectionError | RequestError, recordsets: RecordSets<T>, returnValue: T, rowsAffected: number) => void): this;

    /** Cancel currently executing request. */
    cancel(): this;
}

/*************************************
 *** CUSTOM ERRORS
 *************************************/

export class ConnectionError extends Error {
    code: string;
    originalError: Error;

    constructor(message: string | Error, code?: string);
}

export class TransactionError extends Error {
    code: string;
    originalError: Error;

    constructor(message: string | Error, code?: string);
}

export class RequestError extends Error {
    number: number;
    lineNumber: number;
    state: string;
    class: string;
    serverName: string;
    procName: string;
    code: string;
    originalError: Error;

    constructor(message: string | Error, code?: string);
}

export class PreparedStatementError extends Error {
    code: string;
    originalError: Error;

    constructor(message: string | Error, code?: string);
}

/*************************************
 *** GLOBAL CONNECTION
 *************************************/

/**
 * Open global connection.
 * 
 * @param       config          Connection configuration or connection string.
 */
export function connect(config: string | Configuration): Promise<Configuration>;

/**
 * Open global connection.
 * 
 * @param       config          Connection configuration or connection string.
 * @param       callback        A callback which is called after connection has established, or an error has occurred.
 */
export function connect(config: string | Configuration, callback: ErrorCallback<ConnectionError>): Connection;

/**
 * Close global connection.
 */
export function close(): Promise<void>;

/**
 * Close global connection.
 * 
 * @param       callback        A callback which is called after connection has closed, or an error has occurred.
 */
export function close(callback: ErrorCallback<ConnectionError>): Connection;

/**
 * Attach evnet handler to global connection.
 * 
 * @param       event           Event name.
 * @param       handler         Event handler.
 */
export function on(event: string, handler: Function): Connection;

/**
 * Creates a new query using global connection from a tagged template string.
 * 
 * @param       strings         Array of string literals.
 * @param       values          Values.
 */
export function query<T>(strings: string[], ...values: any[]): Promise<RecordSet<T>>;

/**
 * Creates a new batch using global connection from a tagged template string.
 * 
 * @param       strings         Array of string literals.
 * @param       values          Values.
 */
export function batch<T>(strings: string[], ...values: any[]): Promise<RecordSet<T>>;

/*************************************
 *** EXPORTS
 *************************************/
 
export import Table = require("./table");
export { 
    RecordSet, 
    RecordSets
} from "./table";

export import ISOLATION_LEVEL = require("./isolationlevel");
export const DRIVERS: string[];
export { 
    TYPES, 
    DataType,
    DataTypeFunction,
    PrecisionedDataType, 
    ScaledDataType,
    SizedDataType
} from "./datatypes";
export const MAX: number;
export const fix: boolean;

export var Promise: PromiseConstructorLike;

/*************************************
 *** RE-EXPORTS TYPES
 *************************************/

// append datatypes to this modules export 
export const Bit: DataTypeFunction;
export const BigInt: DataTypeFunction;
export const Decimal: PrecisionedDataType;
export const Float: DataTypeFunction;
export const Int: DataTypeFunction;
export const Money: DataTypeFunction;
export const Numeric: PrecisionedDataType;
export const SmallInt: DataTypeFunction;
export const SmallMoney: DataTypeFunction;
export const Real: DataTypeFunction;
export const TinyInt: DataTypeFunction;

export const Char: SizedDataType;
export const NChar: SizedDataType;
export const Text: DataTypeFunction;
export const NText: DataTypeFunction;
export const VarChar: SizedDataType;
export const NVarChar: SizedDataType;
export const Xml: DataTypeFunction;

export const Time: ScaledDataType;
export const Date: DataTypeFunction;
export const DateTime: DataTypeFunction;
export const DateTime2: ScaledDataType;
export const DateTimeOffset: ScaledDataType;
export const SmallDateTime: DataTypeFunction;

export const Binary: DataTypeFunction;
export const VarBinary: SizedDataType;
export const Image: DataTypeFunction;

export const UDT: DataTypeFunction;
export const UniqueIdentifier: DataTypeFunction;
export const Geography: DataTypeFunction;
export const Geometry: DataTypeFunction;

export const TVP: DataTypeFunction;

// append upper case datatypes to this modules export 
export const BIT: DataTypeFunction;
export const BIGINT: DataTypeFunction;
export const DECIMAL: PrecisionedDataType;
export const FLOAT: DataTypeFunction;
export const INT: DataTypeFunction;
export const MONEY: DataTypeFunction;
export const NUMERIC: PrecisionedDataType;
export const SMALLINT: DataTypeFunction;
export const SMALLMONEY: DataTypeFunction;
export const REAL: DataTypeFunction;
export const TINYINT: DataTypeFunction;

export const CHAR: SizedDataType;
export const NCHAR: SizedDataType;
export const TEXT: DataTypeFunction;
export const NTEXT: DataTypeFunction;
export const VARCHAR: SizedDataType;
export const NVARCHAR: SizedDataType;
export const XML: DataTypeFunction;

export const TIME: ScaledDataType;
export const DATE: DataTypeFunction;
export const DATETIME: DataTypeFunction;
export const DATETIME2: ScaledDataType;
export const DATETIMEOFFSET: ScaledDataType;
export const SMALLDATETIME: DataTypeFunction;

export const BINARY: DataTypeFunction;
export const VARBINARY: SizedDataType;
export const IMAGE: DataTypeFunction;

export const UNIQUEIDENTIFIER: DataTypeFunction;
export const GEOGRAPHY: DataTypeFunction;
export const GEOMETRY: DataTypeFunction;

/*************************************
 *** DEPRECATED
 *************************************/

/** @deprecated in 0.3.0 */
export const pool: {
    max: number;
    min: number;
    idleTimeoutMillis: number;
};

/** @deprecated in 0.3.0 */
export const connection: {
    userName: string;
    password: string;
    server: string;
};

/**
 * Initialize Tedious connection pool.
 * @deprecated
 */
export function init(): Connection;

/*************************************
 *** CONFIGURATION INTERFACES
 *************************************/

/** Configuration for mssql connection. */
export interface Configuration {
    /** 
     * Driver to use. 
     * Possible values: `tedious`, `msnodesql` or `tds`. 
     * @default "tedious"
     */
    driver?: "tedious" | "msnodesql" | "msnodesqlv8" | "tds" | string;
    /** User name to use for authentication. */
    user?: string;
    /** Password to use for authentication. */
    password?: string;
    /** 
     * Server to connect to. 
     * You can use 'localhost\instance' to connect to named instance. 
     */
    server: string;
    /**
     * Port to connect to.
     * Don't set when connecting to named instance.
     * @default 1433
     */
    port?: number;
    /** Once you set domain, driver will connect to SQL Server using domain login. */
    domain?: string;
    /** Database to connect to (default: dependent on server configuration). */
    database?: string;
    /**
     * Connection timeout in ms.
     * @default 15000
     */
    connectionTimeout?: number;
    /**
     * Request timeout in ms
     * @default 15000
     */
    requestTimeout?: number;
    /**
     * Stream recordsets/rows instead of returning them all at once as an argument of callback.
     * You can also enable streaming for each request independently (`request.stream = true`).
     * Always set to `true` if you plan to work with large amount of rows.
     * @default false
     */
    stream?: boolean;
    
    /** 
     * You can enable built-in JSON parser with `true`. 
     * Once you enable this, recordset will contain rows of parsed JS objects. 
     * 
     * IMPORTANT: In order for this to work, there must be exactly one column named JSON_F52E2B61-18A1-11d1-B105-00805F49916B in the recordset.
     */
    parseJSON?: boolean;
    
    /** Configuration for mssql pool */
    pool?: PoolConfiguration;

    /** Connection string (for use with Microsoft Driver for Node.js for SQL Server). */
    connectionString?: string;

    /** Configuration for drivers */
    options?: TediousConfiguration | NodeSqlServerConfiguration
}

/** Configuration for tedious driver. */
export interface TediousConfiguration {
    /** 
     * The instance name to connect to.
     * The SQL Server Browser service must be running on the database server, 
     * and UDP port 1444 on the database server must be reachable.
     */
    instanceName?: string;

    /**
     * A boolean determining whether or not to use UTC time for values without time zone offset.
     * @default true
     */
    useUTC?: boolean;

    /**
     * A boolean determining whether or not the connection will be encrypted.
     * Encryption support is experimental.
     * @default false
     */
    encrypt?: boolean;

    /** 
     * The version of TDS to use.
     * Available values: `7_1`, `7_2`, `7_3_A`, `7_3_B`, `7_4`.
     * @default "7_4"
     */
    tdsVersion?: string;

    /** Application name used for SQL server logging. */
    appName?: string;

    /**
     * A boolean determining whether to rollback a transaction automatically if any error is encountered during the given transaction's execution. 
     * This sets the value for `XACT_ABORT` during the initial SQL phase of a connection.
     * @default
     */
    abortTransactionOnError?: boolean;
}

/** Configuration for node-sqlserver driver. */
export interface NodeSqlServerConfiguration {
    /** 
     * The instance name to connect to.
     * The SQL Server Browser service must be running on the database server, 
     * and UDP port 1444 on the database server must be reachable.
     */
    instanceName?: string;

    /**
     * Use Windows Authentication.
     * @default false
     */
    trustedConnection?: boolean;

    /**
     * A boolean determining whether or not to use UTC time for values without time zone offset.
     * @default true
     */
    useUTC?: boolean;
}

/** Configuration for mssql pool. */
export interface PoolConfiguration {
    /**
     * The maximum number of connections there can be in the pool.
     * @default 10
     */
    max?: number;
    /**
     * The minimun number of connections there can be in the pool.
     * @default 0
     */
    min?: number;
    /**
     * The Number of milliseconds before closing an unused connection.
     * @default 30000
     */
    idleTimeoutMillis?: number;
}

/*************************************
 *** OTHER INTERFACES
 *************************************/

export interface SqlTypeMap extends Array<SqlTypeMapEntry> {
    /**
     * Register you own type map.
     */
    register(jsType: any, sqlType: any): void;
}

export interface SqlTypeMapEntry {
    js: any;
    sql: any;
}

export interface RequestParameter<T> {
    value: T;
}

/*************************************
 *** TYPES
 *************************************/

export type ErrorCallback<T> = (err: T) => void;