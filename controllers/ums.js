const fs = require('fs');
const bycrypt = require('bcrypt');

const User = require('../models/user');
const UserDocs = require("../models/user_docs");
const { throwError } = require('../utils/utilFunctions');
const { emailGenerator } = require('../utils/email');

exports.signup = ( async (req, res, next) => {
    const firstName = req.body["first_name"];
    const lastName = req.body["last_name"];
    const roleId = req.body["role_id"];
    const title = req.body.title;
    const dob = req.body.dob;
    const emailId = req.body["email_id"];
    const mobileNumber = req.body["mobile_no"];
    const gender = req.body.gender;
    
    let password = req.body.password;
    try {
        password = await bycrypt.hash(password, 12);
    }
    catch(err){
        err.status = 500;
        err.msg = 'Something went wrong while encrypting the password!';
        return next(err);
    };

    const user = new User(roleId, firstName, lastName, title, dob, gender, emailId, mobileNumber, password);
    try{
        await user.save();
        return res.status(201).json({msg: "User successfully signed up"});
    }
    catch(err){
        return next(err);
    }
});

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
        files.forEach(file => {
            fs.rm(file.path, {}, err => {
                if(err){
                    const error = new Error();
                    error.msg = "Something went wrong while deleting file from system!";
                    error.status = 500;
                }
            });
        });
        next(err);
    }
}