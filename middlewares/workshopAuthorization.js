const Role = require("../models/roles");

const { roles } = require("../utils/constants");
const { throwError } = require("../utils/utils");

exports.verifyUserRole = async (req, res, next) => {
    const user = res.locals.user;
    try {
        const result = await Role.findRole(user['role_id']);
        if(result.recordset.length == 0){
            throwError("Role associated with user is either invalid or no longer exists!", 404);
        }
        const role = result.recordset[0]['role_name'];
        if(role.toLowerCase() != roles.COORDINATOR){
            throwError("User does not have coordinator role", 403);
        }
        next();
    }
    catch(err){
        next(err);
    }
};