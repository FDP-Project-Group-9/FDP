const fs = require('fs');
const bycrypt = require('bcrypt');
const jwt=require('jsonwebtoken')

const User = require('../models/user');
const UserDocs = require("../models/userDocs");
const Role = require("../models/roles");

const { throwError } = require('../utils/helper');
const { emailGenerator } = require('../config/email');
const { roles } = require("../utils/constants"); 
const { removeFiles } = require('../config/fileDirectory');

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
            profile_approved = false;
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
            const userDocsDetails = await UserDocs.findUserDocs(user.user_id);
            if(userDocsDetails.recordsets[0].length == 0)
                throwError("Please upload identity documents for signup verification!", 404);
            throwError("Registration of User is not approved", 403);
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
    const id=req.params.id
    try{
        const user_details=await User.findUserById(id);
        const user=user_details.recordsets[0][0];
        if(user)
            delete user.password;
        if(!user){
            throwError("Invalid User id", 400);
        }
        return res.status(200).json({user:user})
    }
    catch(err){
        return next(err);
    }
}

exports.authorize=async(req,res,next)=>{
    try{
        const authorized_user=await User.findUserById(req.params.id)
        let authorize_user=authorized_user.recordsets[0][0];
        if(!authorize_user){
            throwError("User not found!", 404);
        }
        const updation=await User.updateUserRoleId(true,authorize_user.user_id)
        authorize_user=await User.findUserById(req.params.id)
        authorize_user=authorized_user.recordsets[0][0]
        return res.status(200).json({msg: "User approved!"});
    }
    catch(err){
        return next(err);
    }
}



exports.uploadFiles = async (req, res, next) => { 
    const emailId = req.body['email_id'];
    const files = req.files;
    const attachments = files.map(file => {
        return {
            path: file.path,
            contentType: file.mimetype,
        };
    });

    try{
        const result = await User.findUserByEmail(emailId);
        if(result.recordset.length == 0){
            throwError("User not found!", 404);
        }
        const userId = result.recordset[0]['user_id'];
        await UserDocs.addDocumentsForUser(userId, files);
        res.status(200).json({msg: "Files uploaded successfully!"});

        try{
            const admins = await User.findAllAdministrators();
            const userEmailId = result.recordset[0]["email_id"];
            const userName = result.recordset[0]["first_name"] + " " + result.recordset[0]["last_name"];
            const adminEmails = admins.recordset.map(record => record["email_id"]).join(', ');
            const subject = "Coordinator user verification required!";
            const content = `
                <h3>User Verification Required!</h3>
                <p>Please find the attached documents to verify the user
                 <b>${userName}<b> (${userEmailId}).
                </p>
            `;
            emailGenerator(adminEmails, subject, content, attachments);
        }
        catch(err){
            next(err);
        }
    }
    catch(err){
        // removing files from file system if error occurs...
        removeFiles(files);
        next(err);
    }
}

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