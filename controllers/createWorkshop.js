const Workshop = require("../models/workshop");
const CoordinatorDetails = require("../models/coordinatorDetails");
const Institute = require("../models/institute");
const WorkshopDetails = require("../models/workshopDetails");
const User = require("../models/user");
const Role = require("../models/roles");

const { throwError } = require("../utils/helper");
const { roles } = require("../utils/constants");

exports.createWorkshopDraft = async (req, res, next) => {
    const user = res.locals.user;
    const userId = user['user_id'];
    const workshop = new Workshop(userId);

    try {
        const result = await workshop.createWorkshop();
        const workshopId = result.recordset[0]['workshop_id'];
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

exports.putCoordinatorDetails = async (req, res, next) => {
    const user = res.locals.user;
    const edit = req.query.edit;
    const userId = user['user_id'];
    const workshopId = req.body['workshop_id'];
    const coCoordinatorEmailId = req.body['co_coordinator_email_id'];

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

    let details, workshopInfo, coCoordinatorId; 

    //find if co-coordinator exists
    if(coCoordinatorEmailId){
        try{
            coCoordinatorId = await User.findUserByEmail(coCoordinatorEmailId);
            if(coCoordinatorId.recordset.length == 0){
                throwError("Co-coordinator not found!", 404);
            }
            const result = await Role.findRole(coCoordinatorId.recordset[0]['role_id']);
            if(result.recordset.length == 0){
                throwError("Role associated with co-coordinator is either invalid or no longer exists!", 404);
            }
            const role = result.recordset[0]['role_name'];
            if(role.toLowerCase() != roles.COORDINATOR){
                throwError("User email provided for co-coordinator is not a coordinator", 403);
            }
            coCoordinatorId = coCoordinatorId.recordset[0]['user_id'];
        }
        catch(err){
            next(err);
            return;
        }
    }

    //check if the user creating/ modifying the details is the owner
    try{
        workshopInfo = await Workshop.getWorkshopDetails(workshopId);
        workshopInfo = workshopInfo.recordset[0];
        if(workshopInfo['coordinator_id'] != userId){
            throwError("User is not the owner of the workshop!", 403);
        }
    }
    catch(err){
        next(err);
    }

    //find coordinator details if it exists
    try{
        details = await CoordinatorDetails.findDetails(requestData.coordinator_id);
        details = details.recordset[0];
    }
    catch(err){
        next(err);
    }

    //modify details
    if(edit && edit.toLowerCase() == 'true'){
        try{
            if(!details){
                throwError("Details not found!", 404);
            }
            const result = await CoordinatorDetails.updateDetails(requestData);
            const data = { 
                ...workshopInfo,
                co_coordinator_id: coCoordinatorId, 
                workshop_id: workshopId
            };
            await Workshop.updateWorkshop(data);
            res.status(200).json({
                msg: "Coordinator details updated successfully!"
            });
        }
        catch(err){
            next(err);
        }
    }
    //add details
    else{
        const coordinatorDetails = new CoordinatorDetails(requestData);
    
        try{
            if(details){
                throwError("User details already exists, cannot create new!", 409);
            }
            const result = await coordinatorDetails.addCoordinatorDetails();
            const data = { 
                ...workshopInfo,
                co_coordinator_id: coCoordinatorId, 
                workshop_id: workshopId
            };
            await Workshop.updateWorkshop(data);
            res.status(201).json({
                msg: "Coordinator details added successfully!"
            });
        }
        catch(err){
            next(err);
        }
    }
};

exports.putInstituteDetails = async (req, res, next) => {
    const user = res.locals.user;
    const userId = user['user_id'];
    const edit = req.query.edit;
    const workshopId = req.body['workshop_id'];

    const requestData = {
        coordinator_id: userId,
        aicte_approved: req.body['aicte_approved'],
        pid: req.body['pid'],
        institute_type: req.body['institute_type'],
        institute_name: req.body['institute_name'],
        institute_address: req.body['institute_address'],
        state_name: req.body['state_name'],
        district_name: req.body['district_name']
    };

    let details, workshopInfo;

    //check if the user creating/ modifying the details is the owner
    try{
        workshopInfo = await Workshop.getWorkshopDetails(workshopId);
        workshopInfo = workshopInfo.recordset[0];
        if(workshopInfo['coordinator_id'] != userId){
            throwError("User is not the owner of the workshop!", 403);
        }
    }
    catch(err){
        next(err);
    }

    // find institute details if it exists
    try{
        details = await Institute.findDetails(userId);
        details = details.recordset[0];
    }
    catch(err){
        next(err);
    }

    //modify details
    if(edit && edit.toLowerCase() == 'true'){
        try {
            if(!details){
                throwError("Details not found!", 404);
            }
            const result = await Institute.updateDetails(requestData);
            res.status(200).json({
                msg: "Insitute Details updated successfully!"
            });
        }
        catch(err){
            next(err);
        }
    }
    //add details
    else{
        try{
            if(details){
                throwError("Insitute details already exist, cannot add new!", 409);
            }
            const institute = new Institute(requestData);
            const result = await institute.addInstituteDetails();
            const instituteId = result.recordset[0].id;
            const data = { 
                ...workshopInfo,
                institute_id: instituteId, 
                workshop_id: workshopId
            };
            await Workshop.updateWorkshop(data);
            res.status(201).json({
                msg: "Insitute details added successfully!"
            });
        }
        catch(err){
            next(err);
        }
    }
};

exports.putWorkshopDetails = async (req, res, next) => {
    const edit = req.query.edit;
    const user = res.locals.user;
    const userId = user['user_id'];

    const requestData = {
        workshop_id: req.body['workshop_id'],
        area_specialization_id: req.body['area_specialization_id'],
        sub_area: req.body['sub_area'],
        title: req.body['title'],
        begin_date: req.body['begin_date'],
        end_date: req.body['end_date'],
        mode: req.body['mode'],
        participant_intake: req.body['participant_intake'],
    };

    let details, workshopInfo;

    //check if the user creating/ modifying the details is the owner
    try{
        workshopInfo = await Workshop.getWorkshopDetails(requestData.workshop_id);
        workshopInfo = workshopInfo.recordset[0];
        if(workshopInfo['coordinator_id'] != userId){
            throwError("User is not the owner of the workshop!", 403);
        }
    }
    catch(err){
        next(err);
    }

    // check if the workshop details are already there
    try{
        details = await WorkshopDetails.getDetails(requestData.workshop_id);
        details = details.recordset[0];
    }
    catch(err){
        next(err);
    }

    //modify the details
    if(edit && edit.toLowerCase() == 'true'){
        try{
            if(!details){
                throwError("Details not found!", 404);
            }
            const result = await WorkshopDetails.updateDetails(requestData);
            res.status(200).json({
                msg: "Workshop details updated!"
            });
        }
        catch(err){
            next(err);
        }
    }
    //add details
    else{
        try{
            if(details){
                throwError("Workshop Details already exist, cannot create new!", 409);
            }
            const workshopDetails = new WorkshopDetails(requestData);
            const result = await workshopDetails.addWorkshopDetails();
            const workshopDetailsId = result.recordset[0].id;
            const data = { 
                ...workshopInfo,
                workshop_details_id: workshopDetailsId, 
                workshop_id: requestData.workshop_id
            };
            await Workshop.updateWorkshop(data);
            res.status(201).json({
                msg: "Workshop details added successfully!"
            });
        }
        catch(err){
            next(err);
        }
    }
};