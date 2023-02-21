const { getDB } = require("../config/db");
const { dbTypes, throwError } = require("../utils/helper");
const { tableNames } = require("../utils/constants");
const { colNames } = require("../utils/constants").workshop;

module.exports = class Workshop {
    constructor(coordinatorId) {
        this.coordinatorId = coordinatorId;
    };

    async createWorkshop() {
        const db = getDB();
        const queryStmt = `INSERT INTO ${tableNames.WORKSHOP} 
        (
            ${colNames.coordinatorId},
            ${colNames.coCoordinatorId},
            ${colNames.instituteId},
            ${colNames.workshopDetailsId}
        )
        OUTPUT INSERTED.workshop_id
        VALUES
        (
            ${'@' + colNames.coordinatorId},
            ${'@' + colNames.coCoordinatorId},
            ${'@' + colNames.instituteId},
            ${'@' + colNames.workshopDetailsId}
        )`;
        
        try {
            return await db.request()
            .input(colNames.coordinatorId, dbTypes.Int, this.coordinatorId)
            .input(colNames.coCoordinatorId, dbTypes.Int, this[colNames.coCoordinatorId] ? this[colNames.coCoordinatorId] : null)
            .input(colNames.instituteId, dbTypes.Int, this[colNames.instituteId] ? this[colNames.instituteId] : null)
            .input(colNames.workshopDetailsId, dbTypes.Int, this[colNames.workshopDetailsId] ? this[colNames.workshopDetailsId] : null)
            .query(queryStmt);
        }
        catch(err){
            throwError(err.originalError.info.message, 500);
        }
    };

    //function to get all workshops details
    static async getAllWorkshops(status, approved) {
        const db = getDB();
        let queryStmt = `
            SELECT 
            ${tableNames.WORKSHOP}.${colNames.workshopId},
            ${colNames.draft},
            ${tableNames.WORKSHOP_DETAILS}.title,
            ${tableNames.WORKSHOP_DETAILS}.begin_date,
            ${tableNames.WORKSHOP_DETAILS}.end_date,
            ${tableNames.WORKSHOP_DETAILS}.workshop_approval_status,
            ${tableNames.WORKSHOP_DETAILS}.workshop_completed,
            ${tableNames.WORKSHOP_DETAILS}.area_specialization_id,
            ${tableNames.WORKSHOP_SPECIALIZATION}.specialization
            FROM ${tableNames.WORKSHOP}
            INNER JOIN ${tableNames.WORKSHOP_DETAILS}
            ON ${tableNames.WORKSHOP}.${colNames.workshopDetailsId} = ${tableNames.WORKSHOP_DETAILS}.id 
            INNER JOIN ${tableNames.WORKSHOP_SPECIALIZATION}
            ON ${tableNames.WORKSHOP_SPECIALIZATION}.id = ${tableNames.WORKSHOP_DETAILS}.area_specialization_id`;
        
        const currentDate = new Date();

        if(status){
            switch(status) {
                case "ongoing": queryStmt += ` AND @current_date BETWEEN ${tableNames.WORKSHOP_DETAILS}.begin_date AND ${tableNames.WORKSHOP_DETAILS}.end_date`;
                                break;
                case "completed": queryStmt += ` AND @current_date > ${tableNames.WORKSHOP_DETAILS}.end_date`;
                                  break;
                case "upcoming": queryStmt += ` AND @current_date < ${tableNames.WORKSHOP_DETAILS}.begin_date`;
            };
        }

        if(approved) {
            if(approved.toLowerCase() == 'false')
                approved = false;
            else
                approved = true;

            queryStmt += ` AND ${tableNames.WORKSHOP_DETAILS}.workshop_approval_status = @approved_status`;
        }

        try{
            return await db.request()
            .input('current_date', dbTypes.Date, currentDate)
            .input('approved_status', dbTypes.Bit, approved)
            .query(queryStmt);
        }
        catch(err){
            throwError(err.originalError.info.message, 500);
        }
    };

    static async getAllUserWorkshops(userId, incomplete) {
        const db = getDB();
        let queryStmt = `SELECT * FROM ${tableNames.WORKSHOP} WHERE ${colNames.coordinatorId} = ${'@' + colNames.coordinatorId}`;

        if(incomplete){
            if(incomplete.toLowerCase() == 'false')
                incomplete = false;
            else
                incomplete = true;

            queryStmt += ` AND ${colNames.draft} = ${'@' + colNames.draft}`;
        }

        try{
            return await db.request()
            .input(colNames.coordinatorId, dbTypes.Int, userId)
            .input(colNames.draft, dbTypes.Bit, incomplete)
            .query(queryStmt);
        }
        catch(err){
            throwError(err.originalError.info.message, 500);   
        }
    }

    static async getWorkshopDetails(workshopId) {
        const db = getDB();
        const queryStmt = `SELECT * FROM ${tableNames.WORKSHOP} WHERE workshop_id = @workshop_id`;

        try{
            return await db.request()
            .input('workshop_id', dbTypes.Int, workshopId)
            .query(queryStmt);
        }
        catch(err){
            throwError(err.originalError.info.message, 500);
        }
    };

    static async updateWorkshop(data) {
        const db = getDB();
        const queryStmt = `UPDATE ${tableNames.WORKSHOP} SET 
            ${colNames.coCoordinatorId} = ${'@' + colNames.coCoordinatorId},
            ${colNames.instituteId} = ${'@' + colNames.instituteId},
            ${colNames.workshopDetailsId} = ${'@' + colNames.workshopDetailsId},
            ${colNames.draft} = ${'@' + colNames.draft}
            WHERE workshop_id = ${'@' + colNames.workshopId}`; 
        
        try{
            return await db.request()
            .input(colNames.workshopId, dbTypes.Int, data[colNames.workshopId])
            .input(colNames.coCoordinatorId, dbTypes.Int, data[colNames.coCoordinatorId] ? data[colNames.coCoordinatorId] : null)
            .input(colNames.instituteId, dbTypes.Int, data[colNames.instituteId] ? data[colNames.instituteId] : null)
            .input(colNames.workshopDetailsId, dbTypes.Int, data[colNames.workshopDetailsId] ? data[colNames.workshopDetailsId] : null)
            .input(colNames.draft, dbTypes.Bit, data[colNames.draft])
            .query(queryStmt);
        }
        catch(err){
            throwError(err.originalError.info.message, 500);
        }
    };

    static async updateOPTVerification(workshopId) {
        const db = getDB();
        const queryStmt =  `UPDATE ${tableNames.WORKSHOP}
        SET
        ${colNames.otpVerified} = ${'@' + colNames.otpVerified}
        WHERE ${colNames.workshopId} = ${'@' + colNames.workshopId}`;

        try{
            return await db.request()
            .input(colNames.otpVerified, dbTypes.Bit, true)
            .input(colNames.workshopId, dbTypes.Int, workshopId)
            .query(queryStmt);
        }
        catch(err){
            console.log(err);
            throwError(err.originalError.info.message, 500);
        }
    };
};