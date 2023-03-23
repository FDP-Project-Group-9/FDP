const sql = require('mssql');

const { getDB } = require('../config/db');
const { dbTypes, throwError } = require('../utils/helper'); 
const { tableNames } = require("../utils/constants");
const { colNames } = require("../utils/constants").user_docs;
 
module.exports = class UserDocs {
    static async addDocumentsForUser(userId, files) {
        const db = getDB();
        const table = new sql.Table(tableNames.USERDOCS);

        table.create = true;
        table.columns.add('file_path', dbTypes.VarChar(255), {nullable: false});
        table.columns.add('user_id', dbTypes.Int, { nullable: false});

        files.forEach(file => {
            table.rows.add(file.path, userId);
        });
        
        const request = new sql.Request(db);
        try{
            await request.bulk(table);
        }
        catch(err) {
            throwError("Something went wrong while storing user documents!", 500);
        }
    };  

    static async findUserDocs(userId) {
        const db = getDB(); 
        const queryStmt = `SELECT * FROM 
            ${tableNames.USERDOCS}
            WHERE
            ${colNames.userId} = ${'@' + colNames.userId}
        `;

        try {
            return await db.request()
            .input(colNames.userId, dbTypes.Int, userId)
            .query(queryStmt);
        }
        catch(err) {
            throwError(err.originalError.info.message, 500);
        }
    };
};