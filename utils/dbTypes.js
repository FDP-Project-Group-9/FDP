const sql = require('mssql');

exports.types = {
    Int: sql.Int,
    BigInt: sql.BigInt,
    Date: sql.Date,
    VarChar: sql.VarChar,
    Float: sql.Float,
    Bit: sql.Bit,
};