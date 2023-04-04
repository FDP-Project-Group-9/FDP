const { getDB } = require("../config/db");
const { dbTypes, throwError } = require("../utils/helper");
const { tableNames } = require("../utils/constants");
const { colNames } = require("../utils/constants").workshop;
const { colNames: workshopDetailsColNames } = require("../utils/constants").workshop_details;

module.exports = class Workshop {
    constructor(coordinatorId, instituteId) {
        this.coordinatorId = coordinatorId;
        this.instituteId = instituteId;
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
            .input(colNames.instituteId, dbTypes.Int, this.instituteId)
            .input(colNames.workshopDetailsId, dbTypes.Int, this[colNames.workshopDetailsId] ? this[colNames.workshopDetailsId] : null)
            .query(queryStmt);
        }
        catch(err){
            throwError(err.originalError.info.message, 500);
        }
    };

    //function to get all workshops details
    static async getAllWorkshops(offset = 0, limit = 10, timeline_status, workshopApprovalStatus, isUserAdmin = false) {
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
            ON ${tableNames.WORKSHOP_SPECIALIZATION}.id = ${tableNames.WORKSHOP_DETAILS}.area_specialization_id
            AND
            ${tableNames.WORKSHOP}.${colNames.draft} = 0
        `;
        
        let queryStmt2 = `SELECT 
            count(*) AS total_count 
            FROM ${tableNames.WORKSHOP}
            INNER JOIN ${tableNames.WORKSHOP_DETAILS}
            ON ${tableNames.WORKSHOP}.${colNames.workshopDetailsId} = ${tableNames.WORKSHOP_DETAILS}.id 
            INNER JOIN ${tableNames.WORKSHOP_SPECIALIZATION}
            ON ${tableNames.WORKSHOP_SPECIALIZATION}.id = ${tableNames.WORKSHOP_DETAILS}.area_specialization_id
            AND
            ${tableNames.WORKSHOP}.${colNames.draft} = 0
        `;  

        const currentDate = new Date();

        if(timeline_status){
            switch(timeline_status) {
                case "ongoing": queryStmt += ` AND @current_date BETWEEN ${tableNames.WORKSHOP_DETAILS}.begin_date AND ${tableNames.WORKSHOP_DETAILS}.end_date`;
                                queryStmt2 += ` AND @current_date BETWEEN ${tableNames.WORKSHOP_DETAILS}.begin_date AND ${tableNames.WORKSHOP_DETAILS}.end_date`;
                                break;
                case "completed": queryStmt += ` AND @current_date > ${tableNames.WORKSHOP_DETAILS}.end_date`;
                                  queryStmt2 += ` AND @current_date > ${tableNames.WORKSHOP_DETAILS}.end_date`;
                                  break;
                case "upcoming": queryStmt += ` AND @current_date < ${tableNames.WORKSHOP_DETAILS}.begin_date`;
                                 queryStmt2 += ` AND @current_date < ${tableNames.WORKSHOP_DETAILS}.begin_date`;
            };
        }

        if(isUserAdmin) {
            if(workshopApprovalStatus) {
                if(workshopApprovalStatus.toLowerCase() === 'rejected' || workshopApprovalStatus.toLowerCase() === 'approved') {
                    workshopApprovalStatus = workshopApprovalStatus.toLowerCase() === 'approved' ? true : false;
                    queryStmt += ` AND ${tableNames.WORKSHOP_DETAILS}.workshop_approval_status = @approved_status`;
                    queryStmt2 += ` AND ${tableNames.WORKSHOP_DETAILS}.workshop_approval_status = @approved_status`;
                }
                else if(workshopApprovalStatus.toLowerCase() === 'pending') {
                    queryStmt += ` AND ${tableNames.WORKSHOP_DETAILS}.workshop_approval_status IS NULL`;
                    queryStmt2 += ` AND ${tableNames.WORKSHOP_DETAILS}.workshop_approval_status IS NULL`;
                }
            }
        }
        else {
            queryStmt += ` AND ${tableNames.WORKSHOP_DETAILS}.workshop_approval_status = 1`;
            queryStmt2 += ` AND ${tableNames.WORKSHOP_DETAILS}.workshop_approval_status = 1`;
        }

        queryStmt += `
            ORDER BY ${tableNames.WORKSHOP}.${colNames.workshopId} DESC
            OFFSET ${offset} ROWS
            FETCH NEXT ${limit} ROWS ONLY
        `;

        try{
            return await Promise.all([
                db.request()
                .input('current_date', dbTypes.Date, currentDate)
                .input('approved_status', dbTypes.Bit, workshopApprovalStatus)
                .query(queryStmt),
                db.request()
                .input('current_date', dbTypes.Date, currentDate)
                .input('approved_status', dbTypes.Bit, workshopApprovalStatus)
                .query(queryStmt2),
            ]);
        }
        catch(err){
            throwError(err.originalError.info.message, 500);
        }
    };

    static async getAllUserWorkshops( offset = 0, limit = 10, userId, draft, workshopApprovalStatus, timeline_status) {
        const db = getDB();
        let queryStmt = `SELECT
            ${tableNames.WORKSHOP}.${colNames.workshopId},
            ${colNames.draft},
            ${workshopDetailsColNames.beginDate},
            ${workshopDetailsColNames.endDate},
            ${workshopDetailsColNames.title},
            ${workshopDetailsColNames.workshopApprovalStatus},
            ${workshopDetailsColNames.workshopCompleted},
            ${tableNames.WORKSHOP_SPECIALIZATION}.specialization
            FROM 
            ${tableNames.WORKSHOP} 
            LEFT JOIN
            ${tableNames.WORKSHOP_DETAILS}
            ON 
            ${tableNames.WORKSHOP}.${colNames.workshopId} = ${tableNames.WORKSHOP_DETAILS}.${colNames.workshopId}
            LEFT JOIN 
            ${tableNames.WORKSHOP_SPECIALIZATION}
            ON
            ${tableNames.WORKSHOP_DETAILS}.${workshopDetailsColNames.areaSpecializationId} = ${tableNames.WORKSHOP_SPECIALIZATION}.id
            WHERE 
            ${colNames.coordinatorId} = ${'@' + colNames.coordinatorId}
        `;
        let queryStmt2 = `SELECT 
            count(*) as total_rows 
            FROM ${tableNames.WORKSHOP} 
            LEFT JOIN
            ${tableNames.WORKSHOP_DETAILS}
            ON 
            ${tableNames.WORKSHOP}.${colNames.workshopId} = ${tableNames.WORKSHOP_DETAILS}.${colNames.workshopId}
            LEFT JOIN 
            ${tableNames.WORKSHOP_SPECIALIZATION}
            ON
            ${tableNames.WORKSHOP_DETAILS}.${workshopDetailsColNames.areaSpecializationId} = ${tableNames.WORKSHOP_SPECIALIZATION}.id
            WHERE 
            ${colNames.coordinatorId} = ${'@' + colNames.coordinatorId}
        `;
        const currentDate = new Date();

        if(draft && draft.toLowerCase() === 'true'){
            draft = true;
            queryStmt += ` AND ${colNames.draft} = ${'@' + colNames.draft}`;
            queryStmt2 += ` AND ${colNames.draft} = ${'@' + colNames.draft}`;
        }

        if(timeline_status){
            switch(timeline_status) {
                case "ongoing": queryStmt += ` AND @current_date BETWEEN ${tableNames.WORKSHOP_DETAILS}.begin_date AND ${tableNames.WORKSHOP_DETAILS}.end_date`;
                                queryStmt2 += ` AND @current_date BETWEEN ${tableNames.WORKSHOP_DETAILS}.begin_date AND ${tableNames.WORKSHOP_DETAILS}.end_date`;
                                break;
                case "completed": queryStmt += ` AND @current_date > ${tableNames.WORKSHOP_DETAILS}.end_date`;
                                  queryStmt2 += ` AND @current_date > ${tableNames.WORKSHOP_DETAILS}.end_date`;
                                  break;
                case "upcoming": queryStmt += ` AND @current_date < ${tableNames.WORKSHOP_DETAILS}.begin_date`;
                                 queryStmt2 += ` AND @current_date < ${tableNames.WORKSHOP_DETAILS}.begin_date`;
            };
        }

        if(workshopApprovalStatus) {
            if(workshopApprovalStatus.toLowerCase() === 'rejected' || workshopApprovalStatus.toLowerCase() === 'approved') {
                workshopApprovalStatus = workshopApprovalStatus.toLowerCase() === 'approved' ? true : false;
                queryStmt += ` AND ${tableNames.WORKSHOP_DETAILS}.workshop_approval_status = @approved_status`;
                queryStmt2 += ` AND ${tableNames.WORKSHOP_DETAILS}.workshop_approval_status = @approved_status`;
            }
            else if(workshopApprovalStatus.toLowerCase() === 'pending') {
                queryStmt += ` AND ${tableNames.WORKSHOP_DETAILS}.workshop_approval_status IS NULL AND ${colNames.draft} = 0`;
                queryStmt2 += ` AND ${tableNames.WORKSHOP_DETAILS}.workshop_approval_status IS NULL AND ${colNames.draft} = 0`;
            }
        }

        queryStmt += `
            ORDER BY ${tableNames.WORKSHOP}.${colNames.workshopId} DESC
            OFFSET ${offset} ROWS
            FETCH NEXT ${limit} ROWS ONLY
        `;

        try{
            return await Promise.all([
                db.request()
                    .input(colNames.coordinatorId, dbTypes.Int, userId)
                    .input(colNames.draft, dbTypes.Bit, draft)
                    .input('current_date', dbTypes.Date, currentDate)
                    .input('approved_status', dbTypes.Bit, workshopApprovalStatus)
                    .query(queryStmt),
                db.request()
                    .input(colNames.coordinatorId, dbTypes.Int, userId)
                    .input(colNames.draft, dbTypes.Bit, draft)
                    .input('current_date', dbTypes.Date, currentDate)
                    .input('approved_status', dbTypes.Bit, workshopApprovalStatus)
                    .query(queryStmt2)
            ]);
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