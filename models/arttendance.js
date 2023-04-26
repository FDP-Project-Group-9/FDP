const { getDB } = require("../config/db");
const { dbTypes, throwError } = require("../utils/helper");
const { colNames } = require("../utils/constants").attendance;
const { tableNames } = require("../utils/constants");
const { colNames: workshopDetailsColNames } = require("../utils/constants").workshop_details;

module.exports = class Attendance {
    constructor (data){
        Object.assign(this, data);
    };

    async addAttendanceDetails() {
        const db = getDB();
        const queryStmt = `INSERT INTO ${tableNames.ATTENDANCE} 
        (
            ${colNames.workshopId},
            ${colNames.participantId}
        )
        VALUES 
        (
            ${'@' + colNames.workshopId},
            ${'@' + colNames.participantId}
        )`;

        try{
            return await db.request()
            .input(colNames.workshopId, dbTypes.Int, this.workshopId)
            .input(colNames.participantId, dbTypes.Int, this.participantId)
            .query(queryStmt);
        }
        catch(err){
            throwError(err.originalError.info.message, 500);
        }
    };

    static async getAttendanceDetails(workshopId,participantId){
     const db=getDB();
        const queryStmt = `SELECT
        ${colNames.id} AS attendanceId,
        ${colNames.day1} AS day1,
        ${colNames.day2} AS day2,
        ${colNames.day3} AS day3,
        ${colNames.day4} AS day4,
        ${colNames.day5} AS day5
        FROM ${tableNames.ATTENDANCE} 
        WHERE
         ${colNames.workshopId}=${'@' + colNames.workshopId} AND 
         ${colNames.participantId}=${'@' + colNames.participantId}`;
    
        try{
          return await db.request()
          .input(colNames.workshopId, dbTypes.Int, workshopId)
          .input(colNames.participantId, dbTypes.Int, participantId)
          .query(queryStmt);
        }
        catch(err){
          throwError(err.originalError.info.message, 500);
        }
      
    }

    static async updateAttendance(data){
     const db=getDB();
     const query=`UPDATE ${tableNames.ATTENDANCE} SET 
     ${colNames.day1}=${'@' + colNames.day1},
     ${colNames.day2}=${'@' + colNames.day2},
     ${colNames.day3}=${'@' + colNames.day3},
     ${colNames.day4}=${'@' + colNames.day4},
     ${colNames.day5}=${'@' + colNames.day5}
     WHERE 
     ${colNames.workshopId}=${'@' + colNames.workshopId} AND
     ${colNames.participantId}=${'@' + colNames.participantId}
     `;

     try{
        return await db.request()
        .input(colNames.participantId, dbTypes.Int, data.participantId)
        .input(colNames.workshopId, dbTypes.Int, data.workshopId)
        .input(colNames.day1, dbTypes.Bit, data.day1)
        .input(colNames.day2, dbTypes.Bit, data.day2)
        .input(colNames.day3, dbTypes.Bit, data.day3)
        .input(colNames.day4, dbTypes.Bit, data.day4)
        .input(colNames.day5, dbTypes.Bit, data.day5)
        .query(query);
      }
      catch(err){
        throwError(err.originalError.info.message, 500);
      }
    }



};