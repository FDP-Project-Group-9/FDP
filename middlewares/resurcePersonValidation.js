const { body } = require("express-validator");

const resourcePerson = require("../models/resourcePerson");
const WorkshopSpecialization = require("../models/workshopSpecialization");

exports.resourcePersondetailsValidation = () => {
    return [
        body("person_name")
            .exists()
            .withMessage("Name is required!")
            .bail()
            .isLength({min: 1, max: 50})
            .withMessage("Name must have atleaat 1 character and atmost 50 characters")
            ,
            body("email_id")
            .if((value, {req}) => {
                if(req.query.edit && req.query.edit.toLowerCase() == 'true'){
                    return false
                }
                else
                   return true;
            })
            .bail()
            .exists()
            .withMessage("Email is required!")
            .bail()
            .isEmail()
            .withMessage("Invalid Email")
            .bail()
            .custom(async emailId => {
                try{
                   
                    const result = await resourcePerson.findresourcePersonByEmail(emailId);
                    if(result.recordset.length > 0)
                        return Promise.reject(
                            {
                                errorMsg: "Resource Person with email id already exists!",
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
        body("mobile_no")
        .if((value, {req}) => {
            if(req.query.edit && req.query.edit.toLowerCase() == 'true'){
                return false
            }
            else
               return true;
        })
        .bail()
        .exists()
        .withMessage("Mobile Number is required!")
        .bail()
        .isLength({min: 10, max: 10})
        .withMessage("Mobile Number should contain 10 digits!")
        .bail()
        .isNumeric()
        .withMessage("Mobile Number should only contain numbers!")
        .bail()
        .custom( async mobileNo => {
            try {
                const result = await resourcePerson.findresourcePersonByMobile(mobileNo);
                if(result.recordset.length > 0)
                    return Promise.reject(
                        {
                            errorMsg: "Resource Person with mobile number already exists!",
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
        body("designation")
        .exists()
        .withMessage("desigation is required")
        ,
        body("specialization_id")
            .exists()
            .withMessage("Specialization Id is required!")
            .bail()
            .custom(async (specializationId) => {
                try {
                    const result = await WorkshopSpecialization.findSpecialization(specializationId);
                    if(result.recordset.length == 0){
                        return Promise.reject(
                            {
                                errorMsg: "Specialization not found!",
                                status: 404
                            }
                        );
                    }
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
        body("country")
        .exists()
        .withMessage("Country is required")
        ,
        body("organization_name")
        .exists()
        .withMessage("Organization name is required")
        .bail() 
        .isLength({min:3,max:80})
        .withMessage("Organization Name must have atleast 3 characters")
    ];
};
