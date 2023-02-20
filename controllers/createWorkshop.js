const Workshop = require("../models/workshop");
const CoordinatorDetails = require("../models/coordinatorDetails");
const { throwError } = require("../utils/utils");

exports.createWorkshopDraft = async (req, res, next) => {
    const user = res.locals.user;
    const userId = user['user_id'];
    const workshop = new Workshop(userId);

    try {
        const result = await workshop.createWorkshop();
        const workshopId = result.recordset[0][''];
        res.status(201).json({
            msg: "workshop draft created!",
            data: {
                workshop_id: workshopId
            }
        });
    }
    catch(err){
        next(err);
    }
};

exports.getWorkshopDraft = async (req, res, next) => {

};

exports.putCoordinatorDetails = async (req, res, next) => {
    const user = res.locals.user;
    const edit = req.query.edit;
    const userId = user['user_id'];

    let requestData = new Object();
    requestData = {
        coordinator_id: userId,
        father_name: req.body['father_name'],
        alternate_email_id: req.body['alternate_email_id'],
        whatsapp_no: req.body['whatsapp_no'],
        state_name: req.body['state_name'],
        district_name: req.body['district_name'],
        permanent_address: req.body['permanent_address'],
        pincode: req.body['pincode'],
        emp_id: req.body['emp_id'],
        designation: req.body.designation,
        specialization_id: req.body['specialization_id'],
        experience: req.body.experience,
    };

    let details; 
    //check if coordinator details already exist
    try{
        details = await CoordinatorDetails.findDetails(requestData.coordinator_id);
        details = details.recordset[0];
    }
    catch(err){
        next(err);
    }

    if(edit && edit.toLowerCase() == 'true'){
        try{
            if(!details){
                throwError("Details not found!", 404);
            }
            const result = await CoordinatorDetails.updateDetails(requestData);
            res.status(200).json({
                msg: "Coordinator details updated successfully!"
            });
        }
        catch(err){
            next(err);
        }
    }
    else{
        const coordinatorDetails = new CoordinatorDetails(requestData);
    
        try{
            if(details){
                throwError("User details already exists, cannot create new!", 409);
            }
            const result = await coordinatorDetails.addCoordinatorDetails();
            res.status(201).json({
                msg: "Coordinator details added successfully!"
            });
        }
        catch(err){
            next(err);
        }
    }
};
