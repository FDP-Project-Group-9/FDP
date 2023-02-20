const { body } = require("express-validator");
const WorkshopSpecialization = require("../models/workshopSpecialization");


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

exports.addCoordinatorDetailsValidations = () => {
    return [
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
    ];
};
