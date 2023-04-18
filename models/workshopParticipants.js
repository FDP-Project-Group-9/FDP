const { getDB } = require("../config/db");
const { dbTypes, throwError } = require("../utils/helper");
const { colNames } = require("../utils/constants").workshop_participants;
const { tableNames } = require("../utils/constants");

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

    static async findDetails(coordinatorId) {
        const db = getDB();
        const queryStmt = `SELECT 
            ${colNames.coordinatorId},
            ${colNames.fatherName},
            ${colNames.alternateEmailId},
            ${colNames.whatsappNo},
            ${colNames.stateName}, 
            ${colNames.districtName},
            ${colNames.permanentAddress},
            ${colNames.pincode},
            ${colNames.empId},
            ${colNames.designation},
            ${colNames.specializationId}, 
            ${colNames.experience},
            ${tableNames.WORKSHOP_SPECIALIZATION}.specialization
            FROM ${tableNames.COORDINATOR_DETAILS}
            INNER JOIN ${tableNames.WORKSHOP_SPECIALIZATION}
            ON ${tableNames.COORDINATOR_DETAILS}.specialization_id = ${tableNames.WORKSHOP_SPECIALIZATION}.id AND coordinator_id = @coordinator_id`;

        try{
            return await db.request()
            .input('coordinator_id', dbTypes.Int, coordinatorId)
            .query(queryStmt);
        }
        catch(err){
            throwError(err.originalError.info.message, 500);
        }
    };
};