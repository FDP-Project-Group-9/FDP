const { getDB } = require("../config/db");
const { tableNames } = require("../utils/constants");
const { colNames } = require("../utils/constants").workshop_details;
const { colNames: userColNames } = require("../utils/constants").user; 
const { colNames: workshopColNames } = require("../utils/constants").workshop; 
const { colNames: instituteColNames } = require("../utils/constants").institute_details; 
const { throwError, dbTypes } = require("../utils/helper");

module.exports = class WorkshopDetails {
    constructor(data){
        Object.assign(this, data);
    };

    async addWorkshopDetails() {
        const db = getDB();
        const queryStmt = `INSERT INTO ${tableNames.WORKSHOP_DETAILS}
        (
            ${colNames.workshopId},
            ${colNames.areaSpecializationId},
            ${colNames.subArea},
            ${colNames.title},
            ${colNames.beginDate},
            ${colNames.endDate},
            ${colNames.mode},
            ${colNames.participantIntake}
        )
        OUTPUT INSERTED.id
        VALUES 
        (
            ${'@' + colNames.workshopId},
            ${'@' + colNames.areaSpecializationId},
            ${'@' + colNames.subArea},
            ${'@' + colNames.title},
            ${'@' + colNames.beginDate},
            ${'@' + colNames.endDate},
            ${'@' + colNames.mode},
            ${'@' + colNames.participantIntake}
        )`;

        try{
            return await db.request()
            .input(colNames.workshopId, dbTypes.Int, this[colNames.workshopId])
            .input(colNames.areaSpecializationId, dbTypes.Int, this[colNames.areaSpecializationId])
            .input(colNames.subArea, dbTypes.VarChar(50), this[colNames.subArea])
            .input(colNames.title, dbTypes.VarChar(100), this[colNames.title])
            .input(colNames.beginDate, dbTypes.Date, this[colNames.beginDate])
            .input(colNames.endDate, dbTypes.Date, this[colNames.endDate])
            .input(colNames.mode, dbTypes.VarChar(50), this[colNames.mode])
            .input(colNames.participantIntake, dbTypes.Int, this[colNames.participantIntake])
            .query(queryStmt);
        }
        catch(err){
            throwError(err.originalError.info.message, 500);
        }
    };

    static async updateDetails(data) {
        const db = getDB();
        const queryStmt = `UPDATE ${tableNames.WORKSHOP_DETAILS} SET
            ${colNames.areaSpecializationId} = ${'@' + colNames.areaSpecializationId},
            ${colNames.subArea} = ${'@' + colNames.subArea},
            ${colNames.title} = ${'@' + colNames.title},
            ${colNames.beginDate} = ${'@' + colNames.beginDate},
            ${colNames.endDate} = ${'@' + colNames.endDate},
            ${colNames.mode} = ${'@' + colNames.mode},
            ${colNames.participantIntake} = ${'@' + colNames.participantIntake}
            WHERE workshop_id = ${'@' + colNames.workshopId}`;

        try{
            return await db.request()
            .input(colNames.workshopId, dbTypes.Int, data[colNames.workshopId])
            .input(colNames.areaSpecializationId, dbTypes.Int, data[colNames.areaSpecializationId])
            .input(colNames.subArea, dbTypes.VarChar(50), data[colNames.subArea])
            .input(colNames.title, dbTypes.VarChar(100), data[colNames.title])
            .input(colNames.beginDate, dbTypes.Date, data[colNames.beginDate])
            .input(colNames.endDate, dbTypes.Date, data[colNames.endDate])
            .input(colNames.mode, dbTypes.VarChar(50), data[colNames.mode])
            .input(colNames.participantIntake, dbTypes.Int, data[colNames.participantIntake])
            .query(queryStmt);
        }
        catch(err){
            throwError(err.originalError.info.message, 500);
        }
    };

    static async getDetails(workshopId) {
        const db = getDB();
        const queryStmt = `SELECT  
            ${colNames.workshopId},
            ${colNames.areaSpecializationId},
            ${colNames.subArea},
            ${colNames.title},
            ${colNames.beginDate},
            ${colNames.endDate},
            ${colNames.mode},
            ${colNames.participantIntake},
            ${colNames.workshopApprovalStatus},
            ${colNames.allotedFunds},
            ${colNames.expenditure},
            ${colNames.quizGenerated},
            ${colNames.quizId},
            ${colNames.workshopCompleted},
            ${tableNames.WORKSHOP_SPECIALIZATION}.specialization as area_specialization
            FROM ${tableNames.WORKSHOP_DETAILS}
            INNER JOIN ${tableNames.WORKSHOP_SPECIALIZATION}
            ON ${tableNames.WORKSHOP_DETAILS}.area_specialization_id = ${tableNames.WORKSHOP_SPECIALIZATION}.id AND workshop_id = @workshop_id`;

        try{
            return await db.request()
            .input('workshop_id', dbTypes.Int, workshopId)
            .query(queryStmt);
        }
        catch(err){
            throwError(err.originalError.info.message, 500);
        }
    };

    static async getDetailsById(workshopDetailsId) {
        const db = getDB();
        const queryStmt = `SELECT  
            ${colNames.workshopId},
            ${colNames.areaSpecializationId},
            ${colNames.subArea},
            ${colNames.title},
            ${colNames.beginDate},
            ${colNames.endDate},
            ${colNames.mode},
            ${colNames.participantIntake},
            ${colNames.workshopApprovalStatus},
            ${colNames.allotedFunds},
            ${colNames.expenditure},
            ${colNames.quizGenerated},
            ${colNames.quizId},
            ${colNames.workshopCompleted},
            ${tableNames.WORKSHOP_SPECIALIZATION}.specialization as area_specialization
            FROM ${tableNames.WORKSHOP_DETAILS}
            INNER JOIN ${tableNames.WORKSHOP_SPECIALIZATION}
            ON ${tableNames.WORKSHOP_DETAILS}.area_specialization_id = ${tableNames.WORKSHOP_SPECIALIZATION}.id AND ${tableNames.WORKSHOP_DETAILS}.id = @workshop_details_id`;

        try{
            return await db.request()
            .input('workshop_details_id', dbTypes.Int, workshopDetailsId)
            .query(queryStmt);
        }
        catch(err){
            throwError(err.originalError.info.message, 500);
        }
    };

    static async approveWorkshop(workshopId, approve) {
        const db = getDB();
        const queryStmt = `UPDATE ${tableNames.WORKSHOP_DETAILS} 
            SET
            ${colNames.workshopApprovalStatus} = ${'@' + colNames.workshopApprovalStatus}
            WHERE ${colNames.workshopId} = ${'@' + colNames.workshopId}`;

        try{
            return await db.request()
            .input(colNames.workshopId, dbTypes.Int, workshopId)
            .input(colNames.workshopApprovalStatus, dbTypes.Bit, approve)
            .query(queryStmt);
        }
        catch(err){
            throwError(err.originalError.info.message, 500);
        }
    };

    static async updateFinanceDetails(workshopId, allotedFunds, expenditure) {
        const db = getDB();
        const queryStmt =  `
            UPDATE ${tableNames.WORKSHOP_DETAILS}
            SET
            ${colNames.allotedFunds} = ${'@' + colNames.allotedFunds},
            ${colNames.expenditure} = ${'@' + colNames.expenditure}
            WHERE
            ${colNames.workshopId} = ${'@' + colNames.workshopId}
        `;

        try {
            return await db.request()
            .input(colNames.allotedFunds, dbTypes.BigInt, allotedFunds)
            .input(colNames.expenditure, dbTypes.BigInt, expenditure)
            .input(colNames.workshopId, dbTypes.BigInt, workshopId)
            .query(queryStmt);
        }
        catch(err) {
            throwError(err.originalError.info.message, 500);
        }
    };

    static async getWorkshopsFinanceReport(month, year, coordinatorId, maxBudget, areaSpecializationId) {
        const db = getDB();
        let queryStmt = `
            SELECT 
            ${tableNames.WORKSHOP}.${colNames.workshopId},
            ${tableNames.WORKSHOP_DETAILS}.${colNames.title},
            ${tableNames.WORKSHOP_DETAILS}.${colNames.areaSpecializationId},
            ${colNames.beginDate},
            ${colNames.endDate},
            ${colNames.mode},
            ${colNames.allotedFunds},
            ${colNames.expenditure},
            ${userColNames.userId},
            ${userColNames.firstName},
            ${userColNames.lastName},
            ${tableNames.INSTITUTE}.${instituteColNames.id} as institute_id,
            ${instituteColNames.aicteApproved},
            ${instituteColNames.instituteName},
            specialization
            FROM ${tableNames.WORKSHOP}
            LEFT JOIN
            ${tableNames.WORKSHOP_DETAILS}
            ON ${tableNames.WORKSHOP}.${workshopColNames.workshopId} = ${tableNames.WORKSHOP_DETAILS}.${colNames.workshopId}
            LEFT JOIN
            ${tableNames.WORKSHOP_SPECIALIZATION}
            ON ${tableNames.WORKSHOP_SPECIALIZATION}.id = ${tableNames.WORKSHOP_DETAILS}.${colNames.areaSpecializationId}
            LEFT JOIN 
            ${tableNames.USERS}
            ON ${tableNames.WORKSHOP}.${workshopColNames.coordinatorId} = ${tableNames.USERS}.${userColNames.userId}
            LEFT JOIN 
            ${tableNames.INSTITUTE}
            ON ${tableNames.INSTITUTE}.${instituteColNames.id} = ${tableNames.WORKSHOP}.${workshopColNames.instituteId}
            WHERE 
            ${tableNames.WORKSHOP_DETAILS}.${colNames.workshopCompleted} = 1
        `;

        if(coordinatorId) {
            queryStmt +=  `
                AND ${tableNames.USERS}.${userColNames.userId} = ${'@' + userColNames.userId}
            `;
        }

        if(areaSpecializationId) {
            queryStmt += `
                AND ${tableNames.WORKSHOP_SPECIALIZATION}.id = @area_specialization_id
            `;
        }

        if(maxBudget) {
            queryStmt += `
                AND ${tableNames.WORKSHOP_DETAILS}.${colNames.expenditure} <= ${'@' + colNames.expenditure}
            `;
        }
        let startDate, endDate;

        if(year) {
            if(month) {
                month = Number(month);
                startDate = new Date(String(year), String(month)), endDate = new Date(String(year), String(Number(month) + 1), '0');
            }
            else {
                startDate = new Date(String(year)), endDate = new Date(String(year), '11', '31');
            }
            queryStmt += `
                AND 
                    (${tableNames.WORKSHOP_DETAILS}.${colNames.beginDate} BETWEEN ${'@startDate'} AND ${'@endDate'})
                AND
                    (${tableNames.WORKSHOP_DETAILS}.${colNames.endDate} BETWEEN ${'@startDate'} AND ${'@endDate'})
            `;
        }

        try {
            return await db.request()
            .input(userColNames.userId, dbTypes.Int, Number(coordinatorId))
            .input('area_specialization_id', dbTypes.Int, Number(areaSpecializationId))
            .input(colNames.expenditure, dbTypes.BigInt, Number(maxBudget))
            .input('startDate', dbTypes.Date, startDate)
            .input('endDate', dbTypes.Date, endDate)
            .query(queryStmt);
        }
        catch(err) {
            throwError(err.originalError.info.message, 500);
        }
    };
};