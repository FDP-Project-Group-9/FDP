const { body } = require("express-validator");
const WorkshopSpecialization = require("../models/workshopSpecialization");
const Workshop = require("../models/workshop");

exports.getWorkshopDraftValidations = () => {
    return [
        body("user_id")
            .exists()
            .withMessage("User id is required!")
        ,
        body("workshop_id")
            .exists()
            .withMessage("Workshop id id is required!")
    ];
};

exports.coordinatorDetailsValidations = () => {
    return [
        body("workshop_id")
            .exists()
            .withMessage("Workshop id is required!")
            .bail()
            .custom(async workshopId => {
                try{
                    const result = await Workshop.getWorkshopDetails(workshopId);
                    if(result.recordset.length == 0){
                        return Promise.reject(
                            {
                                errorMsg: "Workshop not found!",
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
        body("father_name")
            .exists()
            .withMessage("Father Name is required!")
            .bail()
            .isLength({min: 1, max: 50})
            .withMessage("Father name must have atleast 1 character and atmost 50 characters!")
        ,
        body("alternate_email_id")
            .if(value => !!value)
            .isEmail()
            .withMessage("Invalid Alternate Email id!")
        ,
        body("whatsapp_no")
            .if(value => !!value)
            .isLength({min: 10, max: 10})
            .withMessage("Mobile Number should contain 10 digits!")
            .bail()
            .isNumeric()
            .withMessage("Mobile Number should only contain numbers!")
        ,
        body("permanent_address")
            .exists()
            .withMessage("Permanent Address is required!")
        ,
        body("pincode")
            .exists()
            .withMessage("Pincode is required!")
            .bail()
            .isLength({min: 6, max: 6})
            .withMessage("Invalid pincode number!")
        ,
        body("specialization_id")
            .exists()
            .withMessage("Specialization id is required!")
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
        body("co_coordinator_email_id")
            .if(value => !!value)
            .isEmail()
            .withMessage("Invalid Email")
    ];
};


exports.insituteDetailsValidations = () => {
    return [
        body("workshop_id")
            .exists()
            .withMessage("Workshop id is required!")
            .bail()
            .custom(async workshopId => {
                try{
                    const result = await Workshop.getWorkshopDetails(workshopId);
                    if(result.recordset.length == 0){
                        return Promise.reject(
                            {
                                errorMsg: "Workshop not found!",
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
        body("institute_type")
            .exists()
            .withMessage("Insitute Type is required!")
            .bail()
            .isLength({min: 1, max: 30})
            .withMessage("Length of institute type should be between 1 and 30!")
        ,
        body("institute_name")
            .exists()
            .withMessage("Institute Name is required!")
            .bail()
            .isLength({min:1, max: 100})
            .withMessage("Lenght of institute name should be between 1 and 100")
        ,
        body("institute_address")
            .exists()
            .withMessage("Institute address is required!")
            .bail()
            .isLength({min:1, max: 255})
            .withMessage("Length of institute address should be between 1 adnd 255")
    ];
};

exports.workshopDetailsValidations = () => {
    return [
        body("workshop_id")
            .exists()
            .withMessage("Workshop id is required!")
            .bail()
            .custom(async workshopId => {
                try{
                    const result = await Workshop.getWorkshopDetails(workshopId);
                    if(result.recordset.length == 0){
                        return Promise.reject(
                            {
                                errorMsg: "Workshop not found!",
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
        body("area_specialization_id")
            .exists()
            .withMessage("Area specialization id is required!")
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
        body("title")
            .exists()
            .withMessage("Title is required!")
            .bail()
            .isLength({min: 1, max: 100})
            .withMessage("Length of title should be between 1 and 100!")
        ,
        body("begin_date")
            .exists()
            .withMessage("Begin date is required!")
            .bail()
            .if(value => !!value)
            .isDate("YYYY-MM-DD")
            .withMessage("Incorrect date format!")
        ,
        body("end_date")
            .exists()
            .withMessage("End date is required!")
            .bail()
            .if(value => !!value)
            .isDate("YYYY-MM-DD")
            .withMessage("Incorrect date format!")
        ,
        body("mode")
            .exists()
            .withMessage("Mode of workshop is required!")
        ,
        body("participant_intake")
            .exists()
            .withMessage("Participant intake is required!")
            .bail()
            .isNumeric()
            .withMessage("Participant Number should be numeric!")
    ];
};