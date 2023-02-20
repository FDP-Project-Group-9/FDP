const WorkshopSpecialization = require("../models/workshopSpecialization");

exports.addWorkshopSpecialization = async (req, res, next) => {
    const specialization = req.body.specialization;
    const workshopSpecialization = new WorkshopSpecialization(specialization);

    try {
        const result = await workshopSpecialization.addSpecialization();
        res.status(201).json({msg: "Specialization added successfully!"});
    }
    catch(err){
        next(err);
    }
};

exports.getWorkshopSpecializations = async (req, res, next) => {
    try {
        const result = await WorkshopSpecialization.getAllSpecializations();
        const specializations = result.recordsets[0];
        let responseMessage;
        if(specializations.length == 0)
            responseMessage = "No specialization areas found!";
        else
            responseMessage = `Found ${specializations.length} specialization areas!`;
        
        res.status(200).json({
            msg: responseMessage,
            data: specializations
        });
    }
    catch(err){
        next(err);
    }
};