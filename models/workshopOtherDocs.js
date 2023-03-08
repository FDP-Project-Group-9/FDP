const { getDB } = require("../config/db");
const { tableNames } = require("../utils/constants");
const { colNames } = require("../utils/constants").workshop_other_docs;
const { throwError, dbTypes } = require("../utils/helper");

module.exports = class WorkshopOtherDocs {
    constructor(data) {
        Object.assign(this, data);
    }

    async addWorkshopReport() {
        const db = getDB();
        const queryStmt = `INSERT INTO ${tableNames.WORKSHOP_OTHER_DOCS}
            (
                ${colNames.reportUrl},
                ${colNames.workshopId}
            )
            VALUES 
            (
                ${'@' + colNames.reportUrl},
                ${'@' + colNames.workshopId}
            )
        `;

        try {
            return await db.request()
            .input(colNames.reportUrl, dbTypes.VarChar(255), this.fileUrl)
            .input(colNames.workshopId, dbTypes.Int, this.workshopId)
            .query(queryStmt);
        }
        catch (err) {
            throwError(err.originalError.info.message, 500);
        }
    };

    static async deleteWorkshopReport (reportId) {
        const db = getDB();
        const queryStmt = `DELETE FROM
            ${tableNames.WORKSHOP_OTHER_DOCS}
            WHERE
            ${colNames.reportUrl} = ${'@' + colNames.reportUrl}
        `;

        try {
            return await db.request()
            .input(colNames.reportUrl, dbTypes.VarChar(255), reportId)
            .query(queryStmt);
        }
        catch(err) {
            throwError(err.originalError.info.message, 500);
        }
    };

    async addWorkshopCertificate() {
        const db = getDB();
        const queryStmt = `INSERT INTO ${tableNames.WORKSHOP_OTHER_DOCS}
            (
                ${colNames.certificateUrl},
                ${colNames.workshopId}
            )
            VALUES 
            (
                ${'@' + colNames.certificateUrl},
                ${'@' + colNames.workshopId}
            )
        `;

        try {
            return await db.request()
            .input(colNames.certificateUrl, dbTypes.VarChar(255), this.fileUrl)
            .input(colNames.workshopId, dbTypes.Int, this.workshopId)
            .query(queryStmt);
        }
        catch (err) {
            throwError(err.originalError.info.message, 500);
        }
    };

    static async deleteWorkshopCertificate(certificateId) {
        const db = getDB();
        const queryStmt = `DELETE FROM
            ${tableNames.WORKSHOP_OTHER_DOCS}
            WHERE
            ${colNames.certificateUrl} = ${'@' + colNames.certificateUrl}
        `;

        try {
            return await db.request()
            .input(colNames.certificateUrl, dbTypes.VarChar(255), certificateId)
            .query(queryStmt);
        }
        catch(err) {
            throwError(err.originalError.info.message, 500);
        }
    };

    async addWorkshopStmtOExpenditure () {
        const db = getDB();
        const queryStmt = `INSERT INTO ${tableNames.WORKSHOP_OTHER_DOCS}
            (
                ${colNames.stmtExpenditureUrl},
                ${colNames.workshopId}
            )
            VALUES 
            (
                ${'@' + colNames.stmtExpenditureUrl},
                ${'@' + colNames.workshopId}
            )
        `;

        try {
            return await db.request()
            .input(colNames.stmtExpenditureUrl, dbTypes.VarChar(255), this.fileUrl)
            .input(colNames.workshopId, dbTypes.Int, this.workshopId)
            .query(queryStmt);
        }
        catch (err) {
            throwError(err.originalError.info.message, 500);
        }
    };


    static async deleteWorkshopStmtOfExpenditure(stmtOfExpenditureId) {
        const db = getDB();
        const queryStmt = `DELETE FROM
            ${tableNames.WORKSHOP_OTHER_DOCS}
            WHERE
            ${colNames.stmtExpenditureUrl} = ${'@' + colNames.stmtExpenditureUrl}
        `;

        try {
            return await db.request()
            .input(colNames.stmtExpenditureUrl, dbTypes.VarChar(255), stmtOfExpenditureId)
            .query(queryStmt);
        }
        catch(err) {
            throwError(err.originalError.info.message, 500);
        }
    };

    static async findDocumentsByWorkshopId(workshopId) {
        const db = getDB();
        const queryStmt = `SELECT * FROM 
            ${tableNames.WORKSHOP_OTHER_DOCS}
            WHERE
            ${colNames.workshopId} = ${'@' + colNames.workshopId}
        `;

        try{
            return await db.request()
            .input(colNames.workshopId, dbTypes.Int, workshopId)
            .query(queryStmt);
        }
        catch(err) {
            throwError(err.originalError.info.message, 500);
        }
    };

    static async updateOtherDocs (reportUrl, stmtOfExpenditureUrl, certificateUrl, workshopId) {
        const db = getDB();
        const queryStmt = `UPDATE ${tableNames.WORKSHOP_OTHER_DOCS}
            SET
            ${colNames.reportUrl} = ${'@' + colNames.reportUrl},
            ${colNames.certificateUrl} = ${'@' + colNames.certificateUrl},
            ${colNames.stmtExpenditureUrl} = ${'@' + colNames.stmtExpenditureUrl}
            WHERE
            ${colNames.workshopId} = ${'@' + colNames.workshopId}
        `;

        try {
            return await db.request()
            .input(colNames.reportUrl, dbTypes.VarChar(255), reportUrl)
            .input(colNames.certificateUrl, dbTypes.VarChar(255), certificateUrl)
            .input(colNames.stmtExpenditureUrl, dbTypes.VarChar(255), stmtOfExpenditureUrl)
            .input(colNames.workshopId, dbTypes.Int, workshopId)
            .query(queryStmt);
        }
        catch(err) {
            throwError(err.originalError.info.message, 500);
        }
    };
};
