const { getDB } = require('../config/db');
const { types } = require('../utils/dbTypes');
const { throwError } = require('../utils/utilFunctions');

const tableName = 'DevSchema.roles';

module.exports = class Roles {
  static async findRole(roleId){
    const db = getDB();
    const queryStmt = `SELECT role_id FROM ${tableName} WHERE role_id = @role_id`;
    try {
        return await db.request()
        .input('role_id', types.Int, roleId)
        .query(queryStmt);  
    }
    catch(err){
        throwError(err.originalError.info.message, 500);
    }
  }  
};