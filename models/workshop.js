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
    static async getAllWorkshopDetails(workshopId) {
        const db = getDB();
        const result = {};
    };

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
            .input(colNames.draft, dbTypes.Bit, this[colNames.draft] ? data[colNames.draft] : true)
            .query(queryStmt);
        }
        catch(err){
            throwError(err.originalError.info.message, 500);
        }
    };

};