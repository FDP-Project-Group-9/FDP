const Role = require("../models/roles");

const { roles } = require("../utils/constants");
const { throwError } = require("../utils/helper");

exports.verifyCoordinatorRole = async (req, res, next) => {
    const user = res.locals.user;
    try {
        if(!user['role_name']){
            throwError("Role associated with user is either invalid or no longer exists!", 404);
        }
        const role = user['role_name'];
        if(role.toLowerCase() != roles.COORDINATOR){
            throwError("User does not have coordinator role", 403);
        }
        next();
    }
    catch(err){
        next(err);
    }
};

exports.verifyAdministratorRole = async (req, res, next) => {
    const user = res.locals.user;
    try{
        if(!user['role_name']){
            throwError("Role associated with user is either invalid or no longer exists!", 404);
        }
        const role = user['role_name'];
        if(role.toLowerCase() != roles.ADMINISTRATOR){
            throwError("User does not have Administrator role", 403);
        }
        next();
    }
    catch(err){
        next(err);
    }
};