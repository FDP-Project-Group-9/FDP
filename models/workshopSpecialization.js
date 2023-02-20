const { getDB } = require("../config/db");
const { tableNames, dbTypes, throwError } = require("../utils/utils");

module.exports = class WorkshopSpecialization {
    constructor(specialization) {
        this.specialization = specialization;
    };

    async addSpecialization() {
        const db = getDB();
        const queryStmt = `INSERT INTO ${tableNames.WORKSHOP_SPECIALIZATION} 
        (specialization)
        VALUES
        (@specialization)`;

        try {
            return await db.request()
            .input('specialization', dbTypes.VarChar(255), this.specialization)
            .query(queryStmt);
        }
        catch(err){
            throwError(err.originalError.info.message, 500);
        }
    };
    
    static async findSpecialization (specializationId){
        const db = getDB();
        const queryStmt = `SELECT * FROM ${tableNames.WORKSHOP_SPECIALIZATION} WHERE id = @specialization_id`;

        try{
            return await db.request()
            .input('specialization_id', dbTypes.Int, specializationId)
            .query(queryStmt);
        }
        catch(err){
            throwError(err.originalError.info.message, 500);
        }
    };

    static async getAllSpecializations() {
        const db = getDB();
        const queryStmt = `SELECT * FROM ${tableNames.WORKSHOP_SPECIALIZATION}`;

        try {
            return await db.request()
            .query(queryStmt);
        }
        catch(err){
            throwError(err.originalError.info.message, 500);
        }
    };

    static async findIfSpecializationExists(specialization) {
        const db = getDB();
        const queryStmt = `SELECT * FROM ${tableNames.WORKSHOP_SPECIALIZATION} WHERE specialization = @specialization`;

        try {
            return await db.request()
            .input('specialization', dbTypes.VarChar(255), specialization)
            .query(queryStmt);
        }
        catch(err){
            throwError(err.originalError.info.message, 500);
        }
    };
};