const sql = require('mssql');

const { getDB } = require("../config/db");
const { tableNames } = require("../utils/constants");
const { colNames } = require("../utils/constants").workshop_media_photos;
const { throwError, dbTypes } = require("../utils/helper");

module.exports = class WorkshopMediaPhotos {
    constructor(data) {
        Object.assign(this, data);
    };

    async addPhotos () {
        const db = getDB();
        const table = new sql.Table(tableNames.WORKSHOP_MEDIA_PHOTOS);

        table.create = true;
        table.columns.add(colNames.mediaPhotoUrl, dbTypes.VarChar(255), { nullable: false});
        table.columns.add(colNames.workshopId, dbTypes.Int, { nullable: false});

        this.files.forEach(file => {
            table.rows.add(file.path, this.workshopId);
        });

        const request = new sql.Request(db);
        try{
            return await request.bulk(table);
        }
        catch(err) {
            throwError("Something went wrong while storing the media images!", 500);
        }
    };

    static async deleteMediaPhotos (photoId) {
        const db = getDB();
        const queryStmt = `DELETE FROM 
            ${tableNames.WORKSHOP_MEDIA_PHOTOS}
            WHERE 
            ${colNames.id} = ${'@' + colNames.id}
        `;

        try {
            return await db.request()
            .input(colNames.id, dbTypes.Int, photoId)
            .query(queryStmt);
        }
        catch(err) {
            throwError(err.originalError.info.message, 500);
        };
    };

    static async findWorkshopMediaPhtotos (workshopId) {
        const db = getDB();
        const queryStmt = `SELECT * FROM
            ${tableNames.WORKSHOP_MEDIA_PHOTOS}
            WHERE 
            ${colNames.workshopId} = ${'@' + colNames.workshopId}
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
};