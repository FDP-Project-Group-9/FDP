const { getDB } = require("../config/db");
const { dbTypes, throwError } = require("../utils/helper");
const { colNames } = require("../utils/constants").workshop_participants;
const { tableNames } = require("../utils/constants");
const { colNames: workshopDetailsColNames } = require("../utils/constants").workshop_details;

module.exports = class CoordinatorDetails {
    constructor (data){
        Object.assign(this, data);
    };

    async addWorkshopParticipants() {
        const db = getDB();
        const queryStmt = `INSERT INTO ${tableNames.WORKSHOP_PARTICIPANTS} 
        (
            ${colNames.workshopId},
            ${colNames.participantId},
            ${colNames.approvalStatus},
            ${colNames.attendanceId},
            ${colNames.certificateGenerated}, 
            ${colNames.quizAttempted},
            ${colNames.quizScore}
        )
        VALUES 
        (
            ${'@' + colNames.workshopId},
            ${'@' + colNames.participantId},
            ${'@' + colNames.approvalStatus},
            ${'@' + colNames.attendanceId},
            ${'@' + colNames.certificateGenerated}, 
            ${'@' + colNames.quizAttempted},
            ${'@' + colNames.quizScore}     
        )`;

        try{
            return await db.request()
            .input(colNames.workshopId, dbTypes.Int, this.workshopId)
            .input(colNames.participantId, dbTypes.Int, this.participantId)
            .input(colNames.approvalStatus, dbTypes.Int, this.approvalStatus)
            .input(colNames.attendanceId, dbTypes.Int, this.attendanceId)
            .input(colNames.certificateGenerated, dbTypes.Bit, this.certificateGenerated)
            .input(colNames.quizAttempted, dbTypes.Bit, this.quizAttempted)
            .input(colNames.quizScore, dbTypes.Int, this.quizScore)
            .query(queryStmt);
        }
        catch(err){
            throwError(err.originalError.info.message, 500);
        }
    };

    static async updateStatus(data) {
        const db = getDB();  
        const queryStmt =  `UPDATE ${tableNames.WORKSHOP_PARTICIPANTS} SET
        ${colNames.approvalStatus} = ${'@' + colNames.approvalStatus}
        WHERE ${colNames.workshopId} = ${'@' + colNames.workshopId} and ${colNames.participantId} = ${'@' + colNames.participantId}`;

        try{
            return await db.request()
            .input(colNames.workshopId, dbTypes.Int, data.workshopId)
            .input(colNames.approvalStatus, dbTypes.Int, data.approvalStatus)
            .input(colNames.participantId, dbTypes.Int, data.participantId)
            .query(queryStmt);
        }
        catch(err){
            throwError(err.originalError.info.message, 500);
        }
    };
 

    static async getParticipantsWorkshop(offset=0,data){
        const db=getDB();
        let queryStmt =`SELECT
        ${tableNames.WORKSHOP_PARTICIPANTS}.${colNames.workshopId},
        ${colNames.approvalStatus},
        ${workshopDetailsColNames.beginDate},
        ${workshopDetailsColNames.endDate},
        ${workshopDetailsColNames.title},
        ${workshopDetailsColNames.workshopApprovalStatus},
        ${workshopDetailsColNames.workshopCompleted},
        ${tableNames.WORKSHOP_SPECIALIZATION}.specialization
        FROM
        ${tableNames.WORKSHOP_PARTICIPANTS}
        LEFT JOIN 
        ${tableNames.WORKSHOP_DETAILS}
        ON
        ${tableNames.WORKSHOP_PARTICIPANTS}.${colNames.workshopId}=${tableNames.WORKSHOP_DETAILS}.${colNames.workshopId}
        LEFY JOIN 
        ${tableNames.WORKSHOP_SPECIALIZATION}
        ON
        ${tableNames.WORKSHOP_DETAILS}.${workshopDetailsColNames.areaSpecializationId} = ${tableNames.WORKSHOP_SPECIALIZATION}.id
        WHERE 
        ${colNames.participantId}=${'@' + colNames.participantId}
        `;

        let queryStmt2=`SELECT count(*) as total_rows FROM 
        ${tableNames.WORKSHOP_PARTICIPANTS}
        LEFT JOIN
        ${tableNames.WORKSHOP_DETAILS}
        ON
        ${tableNames.WORKSHOP_PARTICIPANTS}.${colNames.workshopId}=${tableNames.WORKSHOP_DETAILS}.${colNames.workshopId}
        LEFY JOIN 
        ${tableNames.WORKSHOP_SPECIALIZATION}
        ON
        ${tableNames.WORKSHOP_DETAILS}.${workshopDetailsColNames.areaSpecializationId} = ${tableNames.WORKSHOP_SPECIALIZATION}.id
        WHERE 
        ${colNames.participantId}=${'@' + colNames.coordinatorId}
        `;
        const currentDate = new Date()

        if(data.timeline_status){
            switch(data.timeline_status){
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
        if(data.participant_approval_status){
            let status=data.participant_approval_status;
            let status_id=1;
            status.toLowerCase()==='rejected'?status_id=-1:status.toLowerCase()==='approved'?status_id=3:status_id=2;
            queryStmt+=` AND ${tableNames.WORKSHOP_PARTICIPANTS}.${colNames.approvalStatus}=${'@' + colNames.approvalStatus}`;
            queryStmt2+=` AND ${tableNames.WORKSHOP_PARTICIPANTS}.${colNames.approvalStatus}=${'@' + colNames.approvalStatus}`;
        }
           
        queryStmt += `
            ORDER BY ${tableNames.WORKSHOP}.${colNames.workshopId} DESC
            OFFSET ${offset} ROWS
            FETCH NEXT ${limit} ROWS ONLY
        `;
          
        try{
            return await Promise.all([
                db.request()
                    .input(colNames.participantId, dbTypes.Int, data.participantId)
                    .input('current_date', dbTypes.Date, currentDate)
                    .input('approved_status', dbTypes.Bit, data.participant_approval_status)
                    .query(queryStmt),
                db.request()
                    .input(colNames.participantId, dbTypes.Int, data.participantId)
                    .input('current_date', dbTypes.Date, currentDate)
                    .input('approved_status', dbTypes.Bit, data.participant_approval_status)
                    .query(queryStmt2)
            ]);
        }
        catch(err){
            throwError(err.originalError.info.message, 500);   
        }

    }
    
};