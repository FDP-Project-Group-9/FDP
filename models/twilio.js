const { getDB } = require("../config/db");
const { throwError, dbTypes } = require("../utils/helper");
const { tableNames } = require("../utils/constants");
const { colNames } = require("../utils/constants").twilio;

module.exports = class Twilio {
    constructor(sid){
        this.sid = sid;
    };

    async addSID(){
        const db = getDB();
        const queryStmt = `INSERT INTO ${tableNames.TWILIO} 
        (
            ${colNames.sid}
        )
        OUTPUT INSERTED.id
        VALUES 
        (
            ${'@' + colNames.sid}
        )`;

        try {
            return await db.request()
            .input(colNames.sid, dbTypes.VarChar(255), this.sid)
            .query(queryStmt);
        }
        catch(err){
            throwError(err.originalError.info.message, 500);
        }
    };

    static async getSID() {
        const db = getDB();
        const queryStmt = `SELECT TOP 1 ${colNames.sid}
             FROM ${tableNames.TWILIO} 
             ORDER BY ${colNames.id} DESC`;
            
        try{
            return await db.request()
            .query(queryStmt);
        }
        catch(err){
            throwError(err.originalError.info.message, 500);
        }
    };
};