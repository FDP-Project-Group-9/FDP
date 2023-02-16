const fs = require('fs');
const bycrypt = require('bcrypt');
const jwt=require('jsonwebtoken')
const User = require('../models/user');
const UserDocs = require("../models/user_docs");
const { throwError } = require('../utils/utilFunctions');

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
     console.log(user)
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
    const password=req.body.password

    const user_details=await User.findUserdetailByEmail(emailId);
    const user=user_details.recordsets[0][0]
    bycrypt.compare(password,user.password)
    .then(isMatch =>{
        if(isMatch){
            const payload={id:user.user_id,email:user.email_id}

            //Sign Token
          jwt.sign(payload,process.env.SECRET_KEY,(err,token)=>{
          return res.status(201).json({
            success:true,
            token:'Bearer '+ token
          })
          })
        }
        else {
          return res.status(401).json({
            msg: "Password is Incorrect"
          })
        }
    })
    .catch(err=>{
        return next(err);
    })
}

exports.uploadFiles = async (req, res, next) => {
    const emailId = req.body['email_id'];
    const files = req.files;
    try{
        const result = await User.findUserByEmail(emailId);
        if(result.recordset.length == 0){
            throwError("User not found!", 404);
        }
        const userId = result.recordset[0]['user_id'];
        await UserDocs.addDocumentsForUser(userId, files);
        res.status(200).json({msg: "Files uploaded successfully!"});
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