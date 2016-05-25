// Type definitions for node-mssql v3
// Project: https://github.com/patriksimek/node-mssql
// Definitions by: Maxime LUCE <https://github.com/SomaticIT/>
// Definitions: https://github.com/typed-contrib/node-mssql

import { DataType } from "./datatypes";

declare class Table {
    create: boolean;
    columns: Table.Columns;
    rows: Table.Rows;

    constructor(name?: string);

    public declare(): string;

    static fromRecordset<T>(recordset: Table.RecordSet<T>): Table;
}

declare namespace Table {
        
    export interface RecordSet<T> extends Array<T> {        
        /** Recordset metadata. */
        columns: { [name: string]: Column };
        
        /** Create a TVP Table using current recordset. */
        toTable(): Table;
    }

    export interface RecordSets<T> extends Array<RecordSet<T>> {
        returnValue: T;
        rowsAffected: number;
    }

    export interface Column {
        index: number;
        name: string;
        type: DataType;
        length?: number;
        scale?: number;
        precision?: number;
        nullable?: boolean;

        udt?: {
            name: string;
            database: string;
            schema: string;
            assembly: string;
        };
    }

    export interface ColumnOptions {
        nullable?: boolean;
        primary?: boolean;
    }

    export interface Columns extends Array<Column> {
        add(name: string, type: DataType): void;
        add(name: string, type: DataType, options: ColumnOptions): void;
    }

    export interface Rows extends Array<any> {
        add(...columns: any[]): void;
    }

}

export = Table;