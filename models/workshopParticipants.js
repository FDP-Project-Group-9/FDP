const { getDB } = require("../config/db");
const { dbTypes, throwError } = require("../utils/helper");
const { colNames } = require("../utils/constants").workshop_participants;
const { tableNames } = require("../utils/constants");
const { colNames: workshopDetailsColNames } = require("../utils/constants").workshop_details;
const { colNames: userDetailscolNames } = require("../utils/constants").user;
const {colNames : QuizDetails} = require('../utils/constants').quizes
const {colNames: questionDetails} =require('../utils/constants').questions

module.exports = class WorkshopParticipants {
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
        ${colNames.approvalStatus} = ${'@' + colNames.approvalStatus},
        ${colNames.attendanceId} = ${'@' + colNames.attendanceId}
        WHERE ${colNames.workshopId} = ${'@' + colNames.workshopId} and ${colNames.participantId} = ${'@' + colNames.participantId}`;

        try{
            return await db.request()
            .input(colNames.workshopId, dbTypes.Int, data.workshopId)
            .input(colNames.approvalStatus, dbTypes.Int, data.approvalStatus)
            .input(colNames.attendanceId, dbTypes.Int, data.attendanceId)
            .input(colNames.participantId, dbTypes.Int, data.participantId)
            .query(queryStmt);
        }
        catch(err){
            throwError(err.originalError.info.message, 500);
        }
    };


    static async getAllparticipants(offset=0,limit=10,workshopId,approvalStatus){
       const db=getDB();
       let queryStmt=`SELECT ${colNames.participantId},
       ${tableNames.USERS}.${userDetailscolNames.title},
       ${tableNames.USERS}.${userDetailscolNames.firstName},
       ${tableNames.USERS}.${userDetailscolNames.lastName},
       ${tableNames.USERS}.${userDetailscolNames.emailId},
       ${tableNames.USERS}.${userDetailscolNames.gender},
       ${tableNames.USERS}.${userDetailscolNames.mobileNo},
       ${tableNames.USERS}.${userDetailscolNames.dob}
        FROM ${tableNames.WORKSHOP_PARTICIPANTS}
        LEFT JOIN 
        ${tableNames.USERS}
        ON 
        ${tableNames.USERS}.${userDetailscolNames.userId}=${tableNames.WORKSHOP_PARTICIPANTS}.${colNames.participantId}
        WHERE
        ${colNames.workshopId}=${workshopId}
       `;
   
       let queryStmt2=`SELECT count(*) as total_rows FROM 
        ${tableNames.WORKSHOP_PARTICIPANTS}
        LEFT JOIN 
        ${tableNames.USERS}
        ON 
        ${tableNames.USERS}.${userDetailscolNames.userId}=${tableNames.WORKSHOP_PARTICIPANTS}.${colNames.participantId}
        WHERE
        ${colNames.workshopId}=${workshopId}
       `;
      
       if(approvalStatus!=undefined){
        let status_id=1;
        status_id=approvalStatus.toLowerCase()==='rejected'?-1:approvalStatus.toLowerCase()==='approved'?3:2;
        console.log(status_id)
        queryStmt+=` AND ${tableNames.WORKSHOP_PARTICIPANTS}.${colNames.approvalStatus}=${status_id}`;
        queryStmt2+=` AND ${tableNames.WORKSHOP_PARTICIPANTS}.${colNames.approvalStatus}=${status_id}`;
    }
    queryStmt += `
        ORDER BY ${colNames.participantId} DESC
        OFFSET ${offset} ROWS
        FETCH NEXT ${limit} ROWS ONLY
    `;
      
       try{
        return await Promise.all([ 
            db.request()
                .query(queryStmt),
            db.request()
                .query(queryStmt2)
        ])

    }
    catch(err){
        // console.log(err)
        throwError(err.originalError.info.message, 500);   
    }

    }
   
 
 
    static async getParticipantWorkshopById(workshopId,participantId){
        const db=getDB();
        let query=`SELECT * FROM ${tableNames.WORKSHOP_PARTICIPANTS} 
        WHERE
        ${colNames.workshopId}=${'@' + colNames.workshopId} AND 
        ${colNames.participantId}=${'@' + colNames.participantId} 
        `;
        try{
            return await db.request()
            .input(colNames.workshopId, dbTypes.Int, workshopId)
            .input(colNames.participantId, dbTypes.Int, participantId)
            .query(query);
        }
        catch(err){
            throwError(err.originalError.info.message, 500);
        }
    }

    static async getParticipantDetailsById(id){
        const db=getDB();
        let queryStmt=`SELECT   ${tableNames.USERS}.${userDetailscolNames.userId},
        ${tableNames.USERS}.${userDetailscolNames.title},
        ${tableNames.USERS}.${userDetailscolNames.firstName},
        ${tableNames.USERS}.${userDetailscolNames.lastName},
        ${tableNames.USERS}.${userDetailscolNames.emailId},
        ${tableNames.USERS}.${userDetailscolNames.gender},
        ${tableNames.USERS}.${userDetailscolNames.mobileNo},
        ${tableNames.USERS}.${userDetailscolNames.dob}
         FROM ${tableNames.USERS}
         WHERE
         ${tableNames.USERS}.${userDetailscolNames.userId}=${id} AND 
         ${userDetailscolNames.roleId}=3
        `;

        try{
            return await db.request()
                    .query(queryStmt)
            
    
        }
        catch(err){
           
            throwError(err.originalError.info.message, 500);   
        }
    }

    static async getParticipantsWorkshop(offset=0,timeline_status,data){
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
        LEFT JOIN 
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
        LEFT JOIN 
        ${tableNames.WORKSHOP_SPECIALIZATION}
        ON
        ${tableNames.WORKSHOP_DETAILS}.${workshopDetailsColNames.areaSpecializationId} = ${tableNames.WORKSHOP_SPECIALIZATION}.id
        WHERE 
        ${colNames.participantId}=${'@' + colNames.participantId}
        `;
        const currentDate = new Date()
       

        if(timeline_status){
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
        if(data.participant_approval_status!=undefined){
            
            let status=data.participant_approval_status;
             
            let status_id=1;
            status_id=status.toLowerCase()==='rejected'?-1:status.toLowerCase()==='approved'?3:2;
           
            queryStmt+=` AND ${tableNames.WORKSHOP_PARTICIPANTS}.${colNames.approvalStatus}=${status_id}`;
            queryStmt2+=` AND ${tableNames.WORKSHOP_PARTICIPANTS}.${colNames.approvalStatus}=${status_id}`;
        }
        queryStmt += `
            ORDER BY ${colNames.workshopId} DESC
            OFFSET ${offset} ROWS
            FETCH NEXT ${data.perPage} ROWS ONLY
        `;
        //   console.log(queryStmt)
        try{
            return await Promise.all([
                db.request()
                    .input(colNames.participantId, dbTypes.Int, data.participantId)
                    .input('current_date', dbTypes.Date, currentDate)
                    .input('participant_approval_status', dbTypes.Bit, data.participant_approval_status)
                    .query(queryStmt),
                db.request()
                    .input(colNames.participantId, dbTypes.Int, data.participantId)
                    .input('current_date', dbTypes.Date, currentDate)
                    .input('participant_approval_status', dbTypes.Bit, data.participant_approval_status)
                    .query(queryStmt2)
            ]);
        }
        catch(err){
            // console.log(err)
            throwError(err.originalError.info.message, 500);   
        }

    }
    
};