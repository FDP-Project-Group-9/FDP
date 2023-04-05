const sql = require("mssql");

const { getDB } = require("../config/db");
const { colNames } = require("../utils/constants").workshop_resource_persons;
const { colNames: resourcePersonsColNames} = require("../utils/constants").resource_persons;
const { tableNames } = require("../utils/constants");
const { dbTypes, throwError } = require("../utils/helper");

module.exports = class WorkshopResourcePersons {
    constructor(data) {
        Object.assign(this, data);
    }

    async addWorkshopResourcePersons() {
        const db = getDB();
        const table = new sql.Table(tableNames.WORKSHOP_RESOURCE_PERSONS);
        table.create = true;
        table.columns.add(colNames.resourcePersonId, dbTypes.Int, { nullable: false });
        table.columns.add(colNames.workshopId, dbTypes.Int, { nullable: false });

        this.resourcePersons.forEach(personId => {
            table.rows.add(personId, this.workshopId);
        });
        
        const request = new sql.Request(db);
        try {
            return await request.bulk(table);
        }
        catch(err) {
            throwError(err.originalError.info.message, 500);
        }
    };

    static async findWorkshopResourcePersonsByWorkshopId(workshopId) {
        const db = getDB();
        const queryStmt = `
            SELECT 
            ${tableNames.RESOURCE_PERSON}.${resourcePersonsColNames.id},
            ${tableNames.RESOURCE_PERSON}.${resourcePersonsColNames.personName},
            ${tableNames.RESOURCE_PERSON}.${resourcePersonsColNames.emailId},
            ${tableNames.RESOURCE_PERSON}.${resourcePersonsColNames.mobileNo},
            ${tableNames.RESOURCE_PERSON}.${resourcePersonsColNames.designation},
            ${tableNames.RESOURCE_PERSON}.${resourcePersonsColNames.specializationId},
            ${tableNames.RESOURCE_PERSON}.${resourcePersonsColNames.country},
            ${tableNames.RESOURCE_PERSON}.${resourcePersonsColNames.stateName},
            ${tableNames.RESOURCE_PERSON}.${resourcePersonsColNames.organizationName},
            ${tableNames.WORKSHOP_SPECIALIZATION}.specialization
            FROM ${tableNames.WORKSHOP_RESOURCE_PERSONS}
            INNER JOIN
            ${tableNames.RESOURCE_PERSON}
            ON ${tableNames.RESOURCE_PERSON}.${resourcePersonsColNames.id} = ${tableNames.WORKSHOP_RESOURCE_PERSONS}.${colNames.resourcePersonId}
            INNER JOIN
            ${tableNames.WORKSHOP_SPECIALIZATION}
            ON ${tableNames.RESOURCE_PERSON}.${resourcePersonsColNames.specializationId} = ${tableNames.WORKSHOP_SPECIALIZATION}.id
            AND ${colNames.workshopId} = ${'@' + colNames.workshopId}
        `;

        try {
            return await db.request()
            .input(colNames.workshopId, dbTypes.Int, workshopId)
            .query(queryStmt);
        }
        catch(err) {
            throwError(err.originalError.info.message, 500);
        }
    };

    static async findWorkshopResourcePersonByBothId(workshopId, resourcePersonId) {
        const db = getDB();
        const queryStmt = `
            SELECT * FROM ${tableNames.WORKSHOP_RESOURCE_PERSONS}
            WHERE
            ${colNames.workshopId} = ${'@' + colNames.workshopId}
            AND 
            ${colNames.resourcePersonId} = ${'@' + colNames.resourcePersonId}
        `;

        try {
            return await db.request()
            .input(colNames.workshopId, dbTypes.Int, workshopId)
            .input(colNames.resourcePersonId, dbTypes.Int, resourcePersonId)
            .query(queryStmt);
        }
        catch(err) {
            throwError(err.originalError.info.message, 500);
        }
    };

    static async deleteWorkshopResourcePerson (workshopId, resourcePersonId) {
        const db = getDB();
        const queryStmt = `DELETE FROM ${tableNames.WORKSHOP_RESOURCE_PERSONS}
            WHERE
            ${colNames.workshopId} = ${'@' + colNames.workshopId}
            AND 
            ${colNames.resourcePersonId} = ${'@' + colNames.resourcePersonId}
        `;

        try {
            return await db.request()
            .input(colNames.workshopId, dbTypes.Int, workshopId)
            .input(colNames.resourcePersonId, dbTypes.Int, resourcePersonId)
            .query(queryStmt);
        }
        catch(err) {
            throwError(err.originalError.info.message, 500);
        }
    };
};