const sql = require('mssql');

const { getDB } = require('../config/db');
const { types } = require('../utils/dbTypes');
const { throwError } = require('../utils/utilFunctions');
const { tableNames } = require('../utils/constants'); 

module.exports = class UserDocs {
    static async addDocumentsForUser(userId, files) {
        const db = getDB();
        const table = new sql.Table(tableNames.USERDOCS);

        table.create = true;
        table.columns.add('file_path', types.VarChar(255), {nullable: false});
        table.columns.add('user_id', types.Int, { nullable: false});

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
};