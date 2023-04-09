const sql = require('mssql');
const { validationResult } = require("express-validator");
const { removeFiles } = require('../config/fileDirectory');
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
        if(req.originalUrl.includes("/workshop/upload")){
            removeFiles(Object.values(req.files)[0]);
          }
        if(req.originalUrl.includes("/ums/upload") && req.files) {
            removeFiles(Object.values(req.files).map(files => files[0]));
        }
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

exports.formatDate = (date) => {
    if(!date)
        return "";
    const newDate = new Date(date);
    const options = {  year: 'numeric', month: 'long', day: 'numeric' };
    return newDate.toLocaleDateString('en-in', options);
};