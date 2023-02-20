const { getDB } = require("../config/db");
const { tableNames, dbTypes, throwError } = require("../utils/utils");
const { colNames } = require("../utils/constants").institute_details;

module.exports = class InstituteDetails {
    constructor(data){
        Object.assign(this, data);
    };

    async addInstituteDetails() {
        const db = getDB();
        const queryStmt = `INSERT INTO ${tableNames.INSTITUTE_DETAILS}
        (
            ${colNames.coordinator_id},
            ${colNames.aicteApproved},
            ${colNames.pid},
            ${colNames.instituteType},
            ${colNames.instituteName},
            ${colNames.instituteAddress},
            ${colNames.stateName},
            ${colNames.districtName}
        )
        VALUES 
        (
            ${'@' + colNames.coordinator_id},
            ${'@' + colNames.aicteApproved},
            ${'@' + colNames.pid},
            ${'@' + colNames.instituteType},
            ${'@' + colNames.instituteName},
            ${'@' + colNames.instituteAddress},
            ${'@' + colNames.stateName},
            ${'@' + colNames.districtName}
        )`;

        try{
            return await db.request()
            .input(colNames.coordinator_id, dbTypes.Int, this[colNames.coordinator_id])
            .input(colNames.aicteApproved, dbTypes.Bit, this[colNames.aicteApproved])
            .input(colNames.pid, dbTypes.Int, this[colNames.pid])
            .input(colNames.instituteType, dbTypes.VarChar(30), this[colNames.instituteType])
            .input(colNames.instituteName, dbTypes.VarChar(100), this[colNames.instituteName])
            .input(colNames.instituteAddress, dbTypes.VarChar(255), this[colNames.instituteAddress])
            .input(colNames.stateName, dbTypes.VarChar(50), this[colNames.stateName])
            .input(colNames.districtName, dbTypes.VarChar(50), this[colNames.districtName])
            .query(queryStmt);
        }
        catch(err){
            throwError(err.originalError.info.message, 500);
        }

    };

    static async updateDetails(data) {
        const db = getDB();
        const queryStmt = `UPDATE ${tableNames.INSTITUTE_DETAILS} SET
        ${colNames.aicteApproved} = ${'@' + colNames.aicteApproved},
        ${colNames.pid} = ${'@' + colNames.pid},
        ${colNames.instituteType} = ${'@' + colNames.instituteType},
        ${colNames.instituteName} = ${'@' + colNames.instituteName},
        ${colNames.instituteAddress} = ${'@' + colNames.instituteAddress},
        ${colNames.stateName} = ${'@' + colNames.stateName},
        ${colNames.districtName} = ${'@' + colNames.districtName}
        WHERE coordinator_id = ${'@' + colNames.coordinator_id}`;

        try{
            return await db.request()
            .input(colNames.coordinator_id, dbTypes.Int, data[colNames.coordinator_id])
            .input(colNames.aicteApproved, dbTypes.Bit, data[colNames.aicteApproved])
            .input(colNames.pid, dbTypes.Int, data[colNames.pid])
            .input(colNames.instituteType, dbTypes.VarChar(30), data[colNames.instituteType])
            .input(colNames.instituteName, dbTypes.VarChar(100), data[colNames.instituteName])
            .input(colNames.instituteAddress, dbTypes.VarChar(255), data[colNames.instituteAddress])
            .input(colNames.stateName, dbTypes.VarChar(50), data[colNames.stateName])
            .input(colNames.districtName, dbTypes.VarChar(50), data[colNames.districtName])
            .query(queryStmt);
        }
        catch(err){
            throwError(err.originalError.info.message, 500);
        }
    };

    static async findDetails(coordinatorId) {
        const db = getDB();
        const queryStmt = `SELECT * from ${tableNames.INSTITUTE_DETAILS} WHERE coordinator_id = @coordinator_id`;

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