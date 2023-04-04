const Role = require("../models/roles");

const { roles } = require("../utils/constants");
const { throwError } = require("../utils/helper");
const { colNames } = require("../utils/constants").user;

exports.verifyCoordinatorRole = async (req, res, next) => {
    const user = res.locals.user;
    try {
        if(!user[colNames.roleName]){
            throwError("Role associated with user is either invalid or no longer exists!", 404);
        }
        const role = user[colNames.roleName];
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
        if(!user[colNames.roleName]){
            throwError("Role associated with user is either invalid or no longer exists!", 404);
        }
        const role = user[colNames.roleName];
        if(role.toLowerCase() != roles.ADMINISTRATOR){
            throwError("User does not have Administrator role", 403);
        }
        next();
    }
    catch(err){
        next(err);
    }
};

exports.checkIfUserIsApproved = async (req, res, next) => {
    const user = res.locals.user;
    try {
        if(user[colNames.profileApproved] == null) {
            throwError("Registration of user is not approved!", 403);
        }
        else if(!user[colNames.profileApproved]){
            throwError("Registration of user has been rejected by the administrator! Please reach out to the administrator", 403);
        }
        next();
    }
    catch(err) {
        next(err);
    }
};