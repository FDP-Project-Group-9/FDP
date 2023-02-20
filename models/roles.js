const { getDB } = require('../config/db');
const { dbTypes, throwError } = require('../utils/helper');
const { tableNames } = require("../utils/constants");

module.exports = class Roles {
  static async findRole(roleId){
    const db = getDB();
    const queryStmt = `SELECT * FROM ${tableNames.ROLES} WHERE role_id = @role_id`;
    try {
        return await db.request()
        .input('role_id', dbTypes.Int, roleId)
        .query(queryStmt);  
    }
    catch(err){
        throwError(err.originalError.info.message, 500);
    }
  }  
};