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

    static async deleteWorkshopReport (fileId, workshopId) {
        const db = getDB();
        const queryStmt = `UPDATE 
            ${tableNames.WORKSHOP_OTHER_DOCS}
            SET
            ${colNames.reportUrl} = ${'@' + colNames.reportUrl}
            WHERE
            ${colNames.id} = ${'@' + colNames.id}
            AND 
            ${colNames.workshopId} = ${'@' + colNames.workshopId}
        `;

        try {
            return await db.request()
            .input(colNames.reportUrl, dbTypes.VarChar(255), null)
            .input(colNames.id, dbTypes.Int, fileId)
            .input(colNames.workshopId, dbTypes.Int, workshopId)
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

    static async deleteWorkshopCertificate(fileId, workshopId) {
        const db = getDB();
        const queryStmt = `UPDATE
            ${tableNames.WORKSHOP_OTHER_DOCS}
            SET
            ${colNames.certificateUrl} = ${'@' + colNames.certificateUrl}
            WHERE
            ${colNames.id} = ${'@' + colNames.id}
            AND
            ${colNames.workshopId} = ${'@' + colNames.workshopId}
        `;

        try {
            return await db.request()
            .input(colNames.certificateUrl, dbTypes.VarChar(255), null)
            .input(colNames.id, dbTypes.Int, fileId)
            .input(colNames.workshopId, dbTypes.Int, workshopId)
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


    static async deleteWorkshopStmtOfExpenditure(fileId, workshopId) {
        const db = getDB();
        const queryStmt = `UPDATE
            ${tableNames.WORKSHOP_OTHER_DOCS}
            SET
            ${colNames.stmtExpenditureUrl} = ${'@' + colNames.stmtExpenditureUrl}
            WHERE
            ${colNames.id} = ${'@' + colNames.id}
            AND
            ${colNames.workshopId} = ${'@' + colNames.workshopId}
        `;

        try {
            return await db.request()
            .input(colNames.stmtExpenditureUrl, dbTypes.VarChar(255), null)
            .input(colNames.id, dbTypes.Int, fileId)
            .input(colNames.workshopId, dbTypes.Int, workshopId)
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

    static async findDocumentsByFileId(fileId) {
        const db = getDB();
        const queryStmt = `SELECT * FROM 
            ${tableNames.WORKSHOP_OTHER_DOCS}
            WHERE
            ${colNames.id} = ${'@' + colNames.id}
        `;

        try{
            return await db.request()
            .input(colNames.id, dbTypes.Int, fileId)
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

    static async addWorkshopBrochure (fileUrl, workshopId) {
        const db = getDB();
        const queryStmt = `
            INSERT INTO ${tableNames.WORKSHOP_OTHER_DOCS}
            (
                ${colNames.brochureUrl},
                ${colNames.workshopId}
            )
            VALUES 
            (
                ${'@' + colNames.brochureUrl},
                ${'@' + colNames.workshopId}
            )
        `;

        try {
            return await db.request()
            .input(colNames.brochureUrl, dbTypes.VarChar(255), fileUrl)
            .input(colNames.workshopId, dbTypes.Int, workshopId) 
            .query(queryStmt);
        }
        catch(err) {
            throwError(err.originalError.info.message, 500);
        }
    };

    static async updateWorkshopBrochure (fileUrl, workshopId) {
        const db = getDB();
        const queryStmt = `
            UPDATE ${tableNames.WORKSHOP_OTHER_DOCS}
            SET 
            ${colNames.brochureUrl} = ${'@' + colNames.brochureUrl}
            WHERE
            ${colNames.workshopId} = ${'@' + colNames.workshopId}
        `;

        try {
            return await db.request()
            .input(colNames.brochureUrl, dbTypes.VarChar(255), fileUrl)
            .input(colNames.workshopId, dbTypes.Int, workshopId) 
            .query(queryStmt);
        }
        catch(err) {
            throwError(err.originalError.info.message, 500);
        }
    };

    static async deleteWorkshopBrochure(fileId, workshopId) {
        const db = getDB();
        const queryStmt = `UPDATE
            ${tableNames.WORKSHOP_OTHER_DOCS}
            SET
            ${colNames.brochureUrl} = ${'@' + colNames.brochureUrl}
            WHERE
            ${colNames.id} = ${'@' + colNames.id}
            AND
            ${colNames.workshopId} = ${'@' + colNames.workshopId}
        `;

        try {
            return await db.request()
            .input(colNames.brochureUrl, dbTypes.VarChar(255), null)
            .input(colNames.id, dbTypes.Int, fileId)
            .input(colNames.workshopId, dbTypes.Int, workshopId)
            .query(queryStmt);
        }
        catch(err) {
            throwError(err.originalError.info.message, 500);
        }
    };
};
