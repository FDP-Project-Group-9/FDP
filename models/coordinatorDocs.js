const sql = require('mssql');

const { getDB } = require('../config/db');
const { dbTypes, throwError } = require('../utils/helper'); 
const { tableNames } = require("../utils/constants");
const { colNames } = require("../utils/constants").user_docs;
 
module.exports = class CoordinatorDocs {

    constructor(data) {
        Object.assign(this, data);
    };

    async addRegistrationDocForUser() {
        const db = getDB();
        const queryStmt = `INSERT INTO ${tableNames.COORDINATOR_DOCS}
            (
                ${colNames.registrationDocUrl},
                ${colNames.userId}
            )
            VALUES
            (
                ${'@' + colNames.registrationDocUrl},
                ${'@' + colNames.userId}
            )
        `;

        try{
            return await db.request()
            .input(colNames.registrationDocUrl, dbTypes.VarChar(255), this[colNames.registrationDocUrl] || "")
            .input(colNames.userId, dbTypes.Int, this[colNames.userId])
            .query(queryStmt);
        }
        catch(err) {
            throwError(err.originalError.info.message, 500);
        }
    };  

    static async findCoordinatorDocs(userId) {
        const db = getDB(); 
        const queryStmt = `SELECT 
            ${colNames.coordinatorMandateUrl},
            ${colNames.coordinatorPhotoUrl},
            ${colNames.registrationDocUrl},
            ${colNames.coordinatorSignatureUrl},
            ${colNames.instituteLogoUrl}
            FROM 
            ${tableNames.COORDINATOR_DOCS}
            WHERE
            ${colNames.userId} = ${'@' + colNames.userId}
        `;

        try {
            return await db.request()
            .input(colNames.userId, dbTypes.Int, userId)
            .query(queryStmt);
        }
        catch(err) {
            throwError(err.originalError.info.message, 500);
        }
    };

    static async updateCoordinatorDocs (dataObj = {}) {
        const db = getDB();
        const queryStmt = `
            UPDATE ${tableNames.COORDINATOR_DOCS}
            SET
            ${colNames.coordinatorMandateUrl} = ${'@' + colNames.coordinatorMandateUrl},
            ${colNames.coordinatorPhotoUrl} = ${'@' + colNames.coordinatorPhotoUrl},
            ${colNames.coordinatorSignatureUrl} = ${'@' + colNames.coordinatorSignatureUrl},
            ${colNames.instituteLogoUrl} = ${'@' + colNames.instituteLogoUrl}
            WHERE
            ${colNames.userId} = ${'@' + colNames.userId}
        `; 

        try {
            return await db.request()
            .input(colNames.coordinatorMandateUrl, dbTypes.VarChar(255), dataObj[colNames.coordinatorMandateUrl] || null)
            .input(colNames.coordinatorPhotoUrl, dbTypes.VarChar(255), dataObj[colNames.coordinatorPhotoUrl] || null)
            .input(colNames.coordinatorSignatureUrl, dbTypes.VarChar(255), dataObj[colNames.coordinatorSignatureUrl] || null)
            .input(colNames.instituteLogoUrl, dbTypes.VarChar(255), dataObj[colNames.instituteLogoUrl] || null)
            .input(colNames.userId, dbTypes.Int, dataObj[colNames.userId])
            .query(queryStmt);
        }
        catch(err) {
            throwError(err.originalError.info.message, 500);
        }
    };
};