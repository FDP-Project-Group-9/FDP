const { getDB } = require("../config/db");
const { tableNames, dbTypes, throwError } = require("../utils/utils");
const { colNames } = require("../utils/constants").coordinator_details;

module.exports = class CoordinatorDetails {
    constructor (data){
        Object.assign(this, data);
    };

    async addCoordinatorDetails() {
        const db = getDB();
        const queryStmt = `INSERT INTO ${tableNames.COORDINATOR_DETAILS} 
        (
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
            ${colNames.experience}
        )
        VALUES 
        (
            ${'@' + colNames.coordinatorId},
            ${'@' + colNames.fatherName},
            ${'@' + colNames.alternateEmailId},
            ${'@' + colNames.whatsappNo},
            ${'@' + colNames.stateName}, 
            ${'@' + colNames.districtName},
            ${'@' + colNames.permanentAddress},
            ${'@' + colNames.pincode},
            ${'@' + colNames.empId  },
            ${'@' + colNames.designation},
            ${'@' + colNames.specializationId}, 
            ${'@' + colNames.experience}
        )`;

        try{
            return await db.request()
            .input(colNames.coordinatorId, dbTypes.Int, this[colNames.coordinatorId])
            .input(colNames.fatherName, dbTypes.VarChar(50), this[colNames.fatherName])
            .input(colNames.alternateEmailId, dbTypes.VarChar(255), this[colNames.alternateEmailId])
            .input(colNames.whatsappNo, dbTypes.VarChar(10), this[colNames.whatsappNo])
            .input(colNames.stateName, dbTypes.VarChar(50), this[colNames.stateName])
            .input(colNames.districtName, dbTypes.VarChar(50), this[colNames.districtName])
            .input(colNames.permanentAddress, dbTypes.VarChar(255), this[colNames.permanentAddress])
            .input(colNames.pincode, dbTypes.Int, this[colNames.pincode])
            .input(colNames.empId, dbTypes.Int, this[colNames.empId])
            .input(colNames.designation, dbTypes.VarChar(30), this[colNames.designation])
            .input(colNames.specializationId, dbTypes.Int, this[colNames.specializationId])
            .input(colNames.experience, dbTypes.Int, this[colNames.experience])
            .query(queryStmt);
        }
        catch(err){
            throwError(err.originalError.info.message, 500);
        }
    };

    static async updateDetails(data) {
        const db = getDB();  
        const queryStmt =  `UPDATE ${tableNames.COORDINATOR_DETAILS} SET
        ${colNames.fatherName} = ${'@' + colNames.fatherName},
        ${colNames.alternateEmailId} = ${'@' + colNames.alternateEmailId},
        ${colNames.whatsappNo} = ${'@' + colNames.whatsappNo},
        ${colNames.stateName} = ${'@' + colNames.stateName}, 
        ${colNames.districtName} = ${'@' + colNames.districtName},
        ${colNames.permanentAddress} = ${'@' + colNames.permanentAddress},
        ${colNames.pincode} = ${'@' + colNames.pincode},
        ${colNames.empId} = ${'@' + colNames.empId},
        ${colNames.designation} = ${'@' + colNames.designation},
        ${colNames.specializationId} = ${'@' + colNames.specializationId}, 
        ${colNames.experience} = ${'@' + colNames.experience}
        WHERE coordinator_id = ${'@' + colNames.coordinatorId}`;

        try{
            return await db.request()
            .input(colNames.coordinatorId, dbTypes.Int, data[colNames.coordinatorId])
            .input(colNames.fatherName, dbTypes.VarChar(50), data[colNames.fatherName])
            .input(colNames.alternateEmailId, dbTypes.VarChar(255), data[colNames.alternateEmailId])
            .input(colNames.whatsappNo, dbTypes.VarChar(10), data[colNames.whatsappNo])
            .input(colNames.stateName, dbTypes.VarChar(50), data[colNames.stateName])
            .input(colNames.districtName, dbTypes.VarChar(50), data[colNames.districtName])
            .input(colNames.permanentAddress, dbTypes.VarChar(255), data[colNames.permanentAddress])
            .input(colNames.pincode, dbTypes.Int, data[colNames.pincode])
            .input(colNames.empId, dbTypes.Int, data[colNames.empId])
            .input(colNames.designation, dbTypes.VarChar(30), data[colNames.designation])
            .input(colNames.specializationId, dbTypes.Int, data[colNames.specializationId])
            .input(colNames.experience, dbTypes.Int, data[colNames.experience])
            .query(queryStmt);
        }
        catch(err){
            throwError(err.originalError.info.message, 500);
        }
    };

    static async findDetails(coordinatorId) {
        const db = getDB();
        const queryStmt = `SELECT 
            ${tableNames.COORDINATOR_DETAILS}.id,
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
            ${colNames.experience}
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