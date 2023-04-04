const fs = require('fs');
const bycrypt = require('bcrypt');
const jwt=require('jsonwebtoken')

const User = require('../models/user');
const CoordinatorDocs = require("../models/coordinatorDocs");
const Role = require("../models/roles");
const Institute = require('../models/institute');

const { throwError } = require('../utils/helper');
const { emailGenerator } = require('../config/email');
const { roles } = require("../utils/constants"); 
const { removeFiles } = require('../config/fileDirectory');
const CoordinatorDetails = require('../models/coordinatorDetails');
const { colNames } = require('../utils/constants').user;


exports.signup = ( async (req, res, next) => {
    const firstName = req.body["first_name"];
    const lastName = req.body["last_name"];
    const roleId = req.body["role_id"];
    const title = req.body.title;
    const dob = req.body.dob;
    const emailId = req.body["email_id"];
    const mobileNumber = req.body["mobile_no"];
    const gender = req.body.gender;
    let profile_approved = true;
    
    let password = req.body.password;
    try {
        password = await bycrypt.hash(password, 12);
    }
    catch(err){
        err.status = 500;
        err.msg = 'Something went wrong while encrypting the password!';
        return next(err);
    };

    // validate the role name and check it is coordinator
    try{
        const result = await Role.findRole(roleId);
        if(result.recordset[0]['role_name'].toLowerCase() == roles.COORDINATOR){
            profile_approved = null;
        }
    }
    catch(err){
        next(err);
    }

    const user = new User(roleId, firstName, lastName, title, dob, gender, emailId, mobileNumber, password, profile_approved);
    try{
        await user.save();
        return res.status(201).json({msg: "User successfully signed up"});
    }
    catch(err){
        return next(err);
    }
});


exports.login= async(req,res,next)=>{
    const emailId = req.body['email_id'];
    const password=req.body.password;
    try{
        const user_details=await User.findUserByEmail(emailId);
        const user=user_details.recordsets[0][0];

        if(user.profile_approved!==true){
            const userDocsDetails = await CoordinatorDocs.findCoordinatorDocs(user.user_id);
            if(userDocsDetails.recordsets[0].length == 0)
                throwError("Please upload identity documents for signup verification!", 404);
            if(user[colNames.profileApproved] == null)
                throwError("Registration of User is not approved", 403);
            else
                throwError("Registration of user has been rejected by the administrator! Please reach out to the administrator", 403);
        }
        const roleDetails = await Role.findRole(user.role_id);
        if(roleDetails.recordset.length == 0)
            throwError("Role not found for user!", 404);
        const roleName = roleDetails.recordset[0]['role_name'];
        bycrypt.compare(password,user.password)
        .then(isMatch =>{
            if(isMatch){
                const payload={
                                id: user.user_id,
                                email: user.email_id,
                                role_id: user.role_id,
                                role_name: roleName,
                                profile_approved: user.profile_approved,
                            };
                //Sign Token
                jwt.sign(payload,process.env.SECRET_KEY, { expiresIn: '1d' },(err,token)=>{
                    return res.status(200).json({
                        success:true,
                        token:'Bearer '+ token,
                        msg: "Successfully LoggedIn!"
                    });
                });
            }
            else {
                throwError("Incorrect Password!", 401);
            }
        })
        .catch(err=>{
            return next(err);
        })
    }
    catch(err){
        return next(err);
    }
}


exports.userDetails=async (req,res,next)=>{
    const id=req.params.id;
    try{
        const user_details=await User.findUserById(id);
        let user=user_details.recordsets[0][0], coordinatorDocs;
        if(user)
            delete user.password;
        if(!user){
            throwError("Invalid User id", 400);
        }

        if(user[colNames.roleName] == roles.COORDINATOR) {
            const coordinatorDetails = await CoordinatorDetails.findDetails(user[colNames.userId]);
            if(coordinatorDetails.recordset[0]) {
                delete coordinatorDetails.recordset[0].coordinator_id;
                delete coordinatorDetails.recordset[0].id;
                user = {...user, ...coordinatorDetails.recordset[0]};
            }
            coordinatorDocs = (await CoordinatorDocs.findCoordinatorDocs(user[colNames.userId])).recordset[0];   
        }

        const instituteDetails = (await Institute.findDetails(user[colNames.userId])).recordset[0];
        if(instituteDetails)
            delete instituteDetails['coordinator_id'];

        const data = {
            personal_details: user,
            institute_details: instituteDetails || null,
        };
        if(user[colNames.roleName] == roles.COORDINATOR){
            data['documents'] = coordinatorDocs || null;
        }
        return res.status(200).json({
            data: data
        });
    }
    catch(err){
        return next(err);
    }
}

exports.approveRejectCoordinatorRegistration=async(req,res,next)=>{
    const userId = req.body.user_id;
    const approve = req.body.approve;
    try{
        const authorized_user=await User.findUserById(userId)
        let authorize_user=authorized_user.recordsets[0][0];
        if(!authorize_user){
            throwError("User not found!", 404);
        }
        const updation=await User.updateUserRoleId(approve, authorize_user.user_id)
        authorize_user=await User.findUserById(req.params.id)
        authorize_user=authorized_user.recordsets[0][0]
        const msg = approve ? 'Coordinator registration approved!' : 'Coordinator registration rejected!';
        return res.status(200).json({msg: msg});
    }
    catch(err){
        return next(err);
    }
};

exports.updateProfile = async (req, res, next) => {
    const userId = req.params.userId;
    const data = {
        [colNames.dob]: req.body[colNames.dob],
        [colNames.title]: req.body[colNames.title],
        [colNames.mobileNo]: req.body[colNames.mobileNo],
        [colNames.gender]: req.body[colNames.gender]
    };

    try {
        if(userId != res.locals.user[colNames.userId]) {
            throwError("Cannot edit other user's profile!", 403);
        }
        await User.updateUserDetails(userId, data);
        res.status(200).json({
            msg: "Profile details updated!"
        });
    }
    catch(err) {
        return next(err);
    }
};


exports.getRoles = async (req, res, next) => {
    try{
        let roles = await Role.getAllRoles();
        roles = roles.recordsets[0];
        res.status(200).json({
            data: roles
        });
    }  
    catch(err){
        next(err);
    }
};

exports.getAllCoordinators = async (req, res, next) => {
    const perPage = Number(req.query.per_page || 10);
    const pageNo = Number(req.query.page_no || 1);
    const profileStatus = req.query.profile_status;

    try {
        let data = [];
        const offset = (pageNo - 1) * perPage;  
        const result = await User.findAllCoordinators(offset, perPage, profileStatus);
        data = [...result[0].recordsets[0]];
        res.status(200).json({
            data: {
                users: data,
                total_count: result[1].recordset[0].total_count
            }
        });
    }
    catch(err) {
        next(err);
    }
};