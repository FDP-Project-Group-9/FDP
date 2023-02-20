const { getDB } = require("../config/db");
const { tableNames, dbTypes, throwError } = require("../utils/utils");

module.exports = class Workshop {
    constructor(userId) {
        this.userId = userId;
    };

    async createWorkshop() {
        const db = getDB();
        const queryStmt = `INSERT INTO ${tableNames.WORKSHOP} 
        (
            coordinator_id,
            co_coordinator_id,
            institute_id,
            workshop_details_id
        )
        VALUES
        (
            @coordinator_id,
            NULL,
            NULL,
            NULL
        );

        SELECT SCOPE_IDENTITY();`;
        
        try {
            return await db.request()
            .input('coordinator_id', dbTypes.Int, this.userId)
            .query(queryStmt);
        }
        catch(err){
            throwError(err.originalError.info.message, 500);
        }
    }
};