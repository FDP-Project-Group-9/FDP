const sql = require('mssql');
const { validationResult } = require("express-validator");
exports.dbTypes = {
    Int: sql.Int,
    BigInt: sql.BigInt,
    Date: sql.Date,
    VarChar: sql.VarChar,
    Float: sql.Float,
    Bit: sql.Bit,
};

exports.throwError = (message, status) => {
    const error = new Error();
    error.msg = message;
    error.status = status;
    throw error;
};

exports.validationErrorHandler = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const errs =  errors.array().map(error => {
            if(typeof(error.msg) == "object"){
                return {
                    msg: error.msg.errorMsg,
                    status: error.msg.status,
                }
            }
            return {    
                msg: error.msg,
                status: 422,
            }
        });
        return res.status(400).json({errors: errs});
    }
    next();
};

exports.getAllResults = (sqlQueryResult) => {
    return sqlQueryResult.recordsets[0];
};

exports.getFirstResult = (sqlQueryResult) => {
    return sqlQueryResult.recordset[0];
};