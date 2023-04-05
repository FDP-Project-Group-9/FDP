const { body } = require("express-validator");

const User = require("../models/user");
const Roles = require("../models/roles");
const { fileUploadNames } = require("../utils/constants");

exports.signupValidationRules = () => {
    return [
        body("role_id")
            .exists()
            .withMessage("Role is required!")
            .bail()
            .custom(async roleId => {
                try {
                    const result = await Roles.findRole(roleId);
                    if(result.recordset.length == 0)
                        return Promise.reject(
                            {
                                errorMsg: "Role not found!",
                                status: 404
                            }
                        );
                }
                catch(err){
                    return Promise.reject(
                        { 
                            errorMsg: err.msg, 
                            status: err.status
                        }
                    );
                }
            })
        ,
        body("email_id")
            .exists()
            .withMessage("Email is required!")
            .bail()
            .isEmail()
            .withMessage("Invalid Email")
            .bail()
            .custom(async emailId => {
                try{
                    const result = await User.findUserByEmail(emailId);
                    if(result.recordset.length > 0)
                        return Promise.reject(
                            {
                                errorMsg: "User with email id already exists!",
                                status: 409
                            }
                        );           
                }
                catch(err){
                    return Promise.reject(
                        { 
                            errorMsg: err.msg, 
                            status: err.status
                        }
                    );
                }
            })
        ,
        body("first_name")
            .exists()
            .withMessage("First Name is a required field!")
            .bail()
            .trim()
            .isLength({min: 1, max: 30})
            .withMessage("First Name should have length between 1 and 30 characters!")
            .bail()
            .isAlpha()
            .withMessage("First name can only contain alphabets")
        ,
        body("last_name")
            .exists()
            .withMessage("Last Name is a required field!")
            .bail()
            .trim()
            .isLength({min: 1, max: 30})
            .withMessage("Last Name should have length between 1 and 30 characters!")
            .bail()
            .isAlpha()
            .withMessage("Last name can only contain alphabets")
        ,
        body("mobile_no")
            .exists()
            .withMessage("Mobile Number is required!")
            .bail()
            .isLength({min: 10, max: 10})
            .withMessage("Mobile Number should contain 10 digits!")
            .bail()
            .isNumeric()
            .withMessage("Mobile Number should only contain numbers!")
            .custom( async mobileNo => {
                try {
                    const result = await User.findUserByMobile(mobileNo);
                    if(result.recordset.length > 0)
                        return Promise.reject(
                            {
                                errorMsg: "User with mobile number already exists!",
                                status: 409
                            }
                        );
                }
                catch(err){
                    return Promise.reject(
                        {
                            errorMsg: err.msg,
                            status: err.status
                        }
                    );
                }
            })
        ,
        body("dob")
            .if(value => !!value)
            .isDate("YYYY-MM-DD")
            .withMessage("Incorrect date format!")
        ,
        body("title")
            .exists()
            .withMessage("Title is required!")
        ,
        body("password")
            .exists()
            .withMessage("Password is required!")
            .bail()
            .isStrongPassword()
            .withMessage("Please provide a stronger password with 1 lowercase, 1 uppercase, 1 special symbol, and a minimum length of 8 characters!")
        ,
        body("confirm_password")
            .exists()
            .withMessage("Confirm password required!")
            .bail()
            .custom( (confirmPassword, { req }) => {
                if(confirmPassword !== req.body.password)
                    return Promise.reject("Confirm Password does not match!")
                return Promise.resolve();
            })
        ,
        body("gender")
            .exists()
            .withMessage("Gender is required!") 
    ];
};

exports.loginValidationRules=()=>{
    return [
        body('email_id')
        .exists()
        .withMessage("Email is Required")
        .bail()
        .isEmail()
        .withMessage("Invalid Email")
        .bail()
        .custom(async (emailId)=>{
            try{
                const result = await User.findUserByEmail(emailId);
                if(result.recordset.length < 1)
                return Promise.reject(
                    {
                        errorMsg: "Email is Incorrect",
                        status: 400
                    }
                    );           
                }
                catch(err){
                    return Promise.reject(
                        { 
                            errorMsg: err.msg, 
                        status: err.status
                    }
                );
            }
        })
        ,
        body("password")
        .exists()
        .withMessage("Password is required!")
        
    ]
};

exports.updateUserDetailsRules = () => {
    return [
        body("dob")
            .if(value => !!value)
            .isDate("YYYY-MM-DD")
            .withMessage("Incorrect date format!")
        ,
        body("title")
            .exists()
            .withMessage("Title is required!")
        ,
        body("mobile_no")
            .exists()
            .withMessage("Mobile Number is required!")
            .bail()
            .isLength({min: 10, max: 10})
            .withMessage("Mobile Number should contain 10 digits!")
            .bail()
            .isNumeric()
            .withMessage("Mobile Number should only contain numbers!")
            .custom( async (mobileNo, { req }) => {
                try {
                    const result = await User.findUserByMobile(mobileNo);
                    if(result.recordset.length > 0 && result.recordset[0].user_id != req.params.userId)
                        return Promise.reject(
                            {
                                errorMsg: "User with mobile number already exists!",
                                status: 409
                            }
                        );
                }
                catch(err){
                    return Promise.reject(
                        {
                            errorMsg: err.msg,
                            status: err.status
                        }
                    );
                }
            })
        ,
        body("gender")
            .exists()
            .withMessage("Gender is required!")
    ];
};

exports.uploadRegistrationDocValidationRules = () => {
    return [
        body("email_id")
            .exists()
            .withMessage("Email is required!")
            .bail()
            .isEmail()
            .withMessage("Invalid Email"),
        body(fileUploadNames.USER.REGISTRATION_DOC)
            .custom((_, { req }) => {
                if(!req.files[fileUploadNames.USER.REGISTRATION_DOC] || req.files[fileUploadNames.USER.REGISTRATION_DOC]?.length == 0)
                    return Promise.reject({
                        errorMsg: "Registration Doc is required!",
                        status: 422
                    });
                return Promise.resolve();
            })
    ];
};


exports.addMandateDocsValidationRules = () => {
    return [
        body("user_id")
            .exists()
            .withMessage("User id is required!")
    ]
};

exports.approveRejectCoordinatorRegistrationValidationRules = () => {
    return [
        body('user_id')
            .exists()
            .withMessage("User id is required!"),
        body('approve')
            .exists('Approval value is required!')
    ];
};