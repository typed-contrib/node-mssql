// Type definitions for node-mssql v3
// Project: https://github.com/patriksimek/node-mssql
// Definitions by: Maxime LUCE <https://github.com/SomaticIT/>
// Definitions: https://github.com/typed-contrib/node-mssql

declare enum ISOLATION_LEVEL {
    READ_UNCOMMITTED = 0x01,
    READ_COMMITTED = 0x02, 
    REPEATABLE_READ = 0x03, 
    SERIALIZABLE = 0x04, 
    SNAPSHOT = 0x05
}

export = ISOLATION_LEVEL;