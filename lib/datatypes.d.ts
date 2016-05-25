// Type definitions for node-mssql v3
// Project: https://github.com/patriksimek/node-mssql
// Definitions by: Maxime LUCE <https://github.com/SomaticIT/>
// Definitions: https://github.com/typed-contrib/node-mssql

export type DataType = DataTypeFunction | DataTypeResult;

export interface DataTypeResult extends DataTypeOptions {
    type: DataTypeFunction;
    declaration: string;
}

export interface DataTypeOptions {
    length?: number;
    precision?: number;
    scale?: number;
    tvpType?: string;
}

export interface DataTypeFunction {
    (): DataTypeResult;
}

export interface SizedDataType extends DataTypeFunction {
    (length: number): DataTypeResult;
}

export interface ScaledDataType extends DataTypeFunction {
    (scale: number): DataTypeResult;
}

export interface PrecisionedDataType extends DataTypeFunction {
    (precision: number): DataTypeResult;
    (precision: number, scale: number): DataTypeResult;
}

export namespace TYPES {
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
}

export namespace DECLARATIONS {
    export const bit: DataTypeFunction;
    export const bigint: DataTypeFunction;
    export const decimal: PrecisionedDataType;
    export const float: DataTypeFunction;
    export const int: DataTypeFunction;
    export const money: DataTypeFunction;
    export const numeric: PrecisionedDataType;
    export const smallint: DataTypeFunction;
    export const smallmoney: DataTypeFunction;
    export const real: DataTypeFunction;
    export const tinyint: DataTypeFunction;

    export const char: SizedDataType;
    export const nchar: SizedDataType;
    export const text: DataTypeFunction;
    export const ntext: DataTypeFunction;
    export const varchar: SizedDataType;
    export const nvarchar: SizedDataType;
    export const xml: DataTypeFunction;

    export const time: ScaledDataType;
    export const date: DataTypeFunction;
    export const datetime: DataTypeFunction;
    export const datetime2: ScaledDataType;
    export const datetimeoffset: ScaledDataType;
    export const smalldatetime: DataTypeFunction;

    export const binary: DataTypeFunction;
    export const varbinary: SizedDataType;
    export const image: DataTypeFunction;

    export const udt: DataTypeFunction;
    export const uniqueidentifier: DataTypeFunction;
    export const geography: DataTypeFunction;
    export const geometry: DataTypeFunction;

    export const tvp: DataTypeFunction;
}

export function declare(type: string, options?: DataTypeOptions): string;

export function cast(value: any, type: string, options?: DataTypeOptions): string | number;