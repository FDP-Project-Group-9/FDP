const Workshop = require("../models/workshop");
const CoordinatorDetails = require("../models/coordinatorDetails");
const Institute = require("../models/institute");
const WorkshopDetails = require("../models/workshopDetails");
const User = require("../models/user");
const Role = require("../models/roles");

const { throwError } = require("../utils/helper");
const { roles } = require("../utils/constants");
const { sendOTP, verifyOTP } = require("../utils/otp");

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

            if(!coCoordinatorId.recordset[0]['profile_approved']){
                throwError("Co-coordinator profile is not approved!", 403);
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
        if(workshopInfo.recordset.length == 0){
            throwError("Workshop not found!", 404);
        }

        workshopInfo = workshopInfo.recordset[0];
        if(workshopInfo['coordinator_id'] != userId){
            throwError("User is not the owner of the workshop!", 403);
        }

        //find coordinator details if it exists
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
        if(workshopInfo.recordset.length == 0){
            throwError("Workshop not found!", 404);
        }

        workshopInfo = workshopInfo.recordset[0];
        if(workshopInfo['coordinator_id'] != userId){
            throwError("User is not the owner of the workshop!", 403);
        }

        // find institute details if it exists
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
            const institute = await Institute.updateDetails(requestData);
            const instituteId = details['id'];
            const data = { 
                ...workshopInfo,
                institute_id: instituteId, 
                workshop_id: workshopId
            };
            await Workshop.updateWorkshop(data);
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

    //check if the user creating/modifying the details is the owner
    try{
        workshopInfo = await Workshop.getWorkshopDetails(requestData.workshop_id);
        if(workshopInfo.recordset.length == 0){
            throwError("Workshop not found!", 404);
        }

        workshopInfo = workshopInfo.recordset[0];
        if(workshopInfo['coordinator_id'] != userId){
            throwError("User is not the owner of the workshop!", 403);
        }

        // check if the workshop details are already there
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
            const workshopDetails = await WorkshopDetails.updateDetails(requestData);
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

exports.createWorkshop = async (req, res, next) => {
    const workshopId = req.body['workshop_id'];
    const user = res.locals.user;
    const userId = user['user_id'];
    let workshopDetails;

    // find the details of workshop and check whether the details are complete
    try{
        workshopDetails = await Workshop.getWorkshopDetails(workshopId);
        if(workshopDetails.recordset.length == 0){
            throwError("Workshop not found!", 404);
        }

        workshopDetails = workshopDetails.recordset[0];

        // check otp verification status
        if(!workshopDetails['otp_verified']){
            throwError("Workshop has not been verified using otp, please verify it!", 401);
        }

        if(workshopDetails['coordinator_id'] != userId){
            throwError("User is not the owner of the workshop!", 403);
        }
        
        // check if institute details are present 
        if(!workshopDetails['institute_id']){
            throwError("Insitute Details are missing!", 400);
        }
        else{
            const instituteDetails = await Institute.findDetailsById(workshopDetails['institute_id']);
            if(instituteDetails.recordset.length == 0){
                const requestData = {...workshopDetails};
                delete requestData['institute_details'];
                await Workshop.updateWorkshop(requestData);
                throwError("Insitute details not found for the corresponding institute id!", 404);
            }
        }

        //check if workshop details are present
        if(!workshopDetails['workshop_details_id']){
            throwError("Workshop Details are missing!", 400);
        }
        else{
            const workshopInfo = await WorkshopDetails.getDetailsById(workshopDetails['workshop_details_id']);
            if(workshopInfo.recordset.length == 0){
                const requestData = {...workshopDetails};
                delete requestData['workshop_details_id'];
                await Workshop.updateWorkshop(requestData);
                throwError("Workshop details not found for the corresponding workshop details id!", 404);
            }
        }

        //check co coordinator details
        if(workshopDetails['co_coordinator_id']){
            const coCoordinatorDetails = await User.findUserById(workshopDetails['co_coordinator_id']);
            if(coCoordinatorDetails.recordset.length == 0){
                const requestData = {...workshopDetails};
                delete requestData['co_coordinator_id'];
                await Workshop.updateWorkshop(requestData);
                throwError("Co-Coordinator not found!", 404);
            }
        }

        workshopDetails['draft'] = false;
        await Workshop.updateWorkshop(workshopDetails);
        res.status(200).json({
            msg: "Workshop created successfully!"
        });
    }
    catch(err){
        next(err);
    }
};

exports.getOTP = async (req, res, next) => {
    const user = res.locals.user;
    const mobileNo = user['mobile_no'];
    try{
        await sendOTP(mobileNo);
        res.status(200).json({
            msg: "OTP Sent to registered mobile number successfully!"
        });
    }
    catch(err){
        next(err);
    }
};

exports.verifyOTP = async (req, res, next) => {
    const user = res.locals.user;
    const mobileNo = user['mobile_no'];
    const otp = req.body.otp;
    const workshopId = req.body['workshop_id'];

    try {
        const result = await verifyOTP(mobileNo, otp);
        if(result.valid){
            const update = await Workshop.updateOPTVerification(workshopId);
            if(update.rowsAffected[0] == 0){
                throwError("Workshop not found!", 404);
            }

            res.status(200).json({
                msg: "OTP verified!"
            });
        }
        else{
            res.status(401).json({
                msg: "Invlaid otp!"
            });
        }
    }
    catch(err){
        next(err);
    }
};