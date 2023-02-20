const { body } = require("express-validator");
const WorkshopSpecialization = require("../models/workshopSpecialization");

exports.addWorkshopSpecializationValidations = () => {
    return [
        body("specialization")
            .exists()
            .withMessage("Specialization is required!")
            .bail()
            .custom(async (specialization) => {
                try {
                    const result = await WorkshopSpecialization.findIfSpecializationExists(specialization);
                    if(result.recordset.length > 0){
                        return Promise.reject(
                            {
                                errorMsg: "Specialization area already exists!",
                                status: 409
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