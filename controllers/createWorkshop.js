const fetch = (...args) =>
	import('node-fetch').then(({default: fetch}) => fetch(...args));
const fs = require('fs');

const Workshop = require("../models/workshop");
const CoordinatorDetails = require("../models/coordinatorDetails");
const Institute = require("../models/institute");
const WorkshopDetails = require("../models/workshopDetails");
const User = require("../models/user");
const Role = require("../models/roles");
const WorkshopResourcePersons = require("../models/workshopResourcePerson");
const ResourcePersonDetails = require("../models/resourcePerson");
const WorkshoPhotos = require("../models/workshopPhotos");

const { throwError, formatDate } = require("../utils/helper");
const { roles, workshop } = require("../utils/constants");
const { sendOTP, verifyOTP } = require("../config/otp");
const { createWorkshopBrochureHandler } = require("../middlewares/workshopBrochure");
const { removeFileByPath } = require("../config/fileDirectory");
const WorkshopOtherDocs = require("../models/workshopOtherDocs");

require('dotenv').config();

function base64_encode(file) {
    // read binary data
    var bitmap = fs.readFileSync(file, 'base64');
    // convert binary data to base64 encoded strin
    // console.log(`data:image/png;base64,${bitmap}`);
    let contentType = 'image/png';

    const fileType = file.split('.').slice(-1);
    if(fileType?.length > 0 && fileType[0] === 'png')
        contentType = 'image/png';
    else if(fileType?.length > 0 && (fileType[0] === 'jpg' || fileType[0] === 'jpeg')) 
        contentType = 'image/jpeg';

    const base64File = `data:${contentType};base64,${bitmap}`;
    return base64File;
}


exports.createWorkshopDraft = async (req, res, next) => {
    const user = res.locals.user;
    const userId = user['user_id'];
    let instituteId = null;
    
    try {
        const instituteResult = await Institute.findDetails(userId);
        if(instituteResult.recordset.length > 0){
            instituteId = instituteResult.recordset[0]['id'];
        }
        const workshop = new Workshop(userId, instituteId);
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
    const updateWorkshop = req.query.update_workshop;
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

    //check if the user creating/ modifying the details is the owne
    try{
        if(updateWorkshop?.toLowerCase() == 'true') {
            workshopInfo = await Workshop.getWorkshopDetails(workshopId);
            if(workshopInfo.recordset.length == 0){
                throwError("Workshop not found!", 404);
            }
    
            workshopInfo = workshopInfo.recordset[0];
            if(workshopInfo['coordinator_id'] != userId){
                throwError("User is not the owner of the workshop!", 403);
            }
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
            if(updateWorkshop?.toLowerCase() == 'true') {
                await Workshop.updateWorkshop(data);
            }
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
            if(updateWorkshop?.toLowerCase() == 'true') {
                await Workshop.updateWorkshop(data);
            }
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
    const updateWorkshop = req.query.update_workshop;
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
        if(updateWorkshop?.toLowerCase() == 'true'){
            workshopInfo = await Workshop.getWorkshopDetails(workshopId);
            if(workshopInfo.recordset.length == 0){
                throwError("Workshop not found!", 404);
            }

            workshopInfo = workshopInfo.recordset[0];
            if(workshopInfo['coordinator_id'] != userId){
                throwError("User is not the owner of the workshop!", 403);
            }
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
            if(updateWorkshop?.toLowerCase() == 'true'){
                await Workshop.updateWorkshop(data);
            }
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
            if(updateWorkshop?.toLowerCase() == 'true'){
                await Workshop.updateWorkshop(data);
            }
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

exports.addWorkshopResourcePersons = async (req, res, next) => {
    const workshopId = req.body.workshop_id;
    const resourcePersons = req.body.resource_persons;

    const data = {
        workshopId: workshopId,
        resourcePersons: resourcePersons
    };

    try {
        let personsDetails = await Promise.all(
            resourcePersons.map(personId => ResourcePersonDetails.getResourcePersonbyId(personId))
        );
        const notFound = personsDetails.find(details => details.recordset.length == 0);
        if(notFound) {
            throwError("Could not find resource person!", 404);
        }
        
        personsDetails = await Promise.all(
            resourcePersons.map(personId => WorkshopResourcePersons.findWorkshopResourcePersonByBothId(workshopId, personId))
        );

        const exists = personsDetails.find(details => details.recordset.length > 0);
        if(exists) {
            throwError("Cannot add same speaker twice!", 400);
        }

        const workshopResourcePersons = new WorkshopResourcePersons(data);
        await workshopResourcePersons.addWorkshopResourcePersons();
        res.status(201).json({
            msg: "Workshop Speakers added successfully!"
        });
    }
    catch(err) {
        next(err);
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
           throwError("Invalid OTP", 401);
        }
    }
    catch(err){
        next(err);
    }
};

exports.approveRejectWorkshop = async (req, res, next) => {
    const workshopId = req.body['workshop_id'];
    const approve = req.body.approve;

    try{
        const result = await WorkshopDetails.approveWorkshop(workshopId, approve);
        if(result.rowsAffected[0] == 0){
            throwError("Workshop not found!", 404);
        }
        const msg = approve ? "Workshop Approved Successfully!" : "Workshop Rejected Successfully!"
        res.status(200).json({
            msg: msg
        });
    }
    catch(err){
        next(err);
    }
};

exports.deleteWorkshopResourcePersons = async (req, res, next) => {
    const workshopId = req.body.workshop_id;
    const resourcePersonId = req.body.resource_person_id;

    try {
        const findResourcePerson = await WorkshopResourcePersons.findWorkshopResourcePersonByBothId(workshopId, resourcePersonId);
        if(findResourcePerson.recordset.length == 0){
            throwError("Workshop Speaker not found in the workshop!", 404);
        }
        await WorkshopResourcePersons.deleteWorkshopResourcePerson(workshopId, resourcePersonId);
        res.status(201).json({
            msg: "Workshop Speaker successfully removed from workshop!"
        });
    }
    catch(err) {
        next(err);
    }
};

exports.createWorkshopBrochure = async (req, res, next) => {
    const workshopId = req.body.workshop_id;
    const userId = res.locals.user.user_id;

    try {
        const workshop = await Workshop.getWorkshopDetails(workshopId);
        if(workshop.recordset[0].draft) {
            throwError("Cannot create brochure before creating the workshop!", 400);
        }
        let workshopDetails = await WorkshopDetails.getDetails(workshopId);
        if(!workshopDetails.recordset[0].workshop_approval_status) {
            throwError("Cannot create brochure for non-approved!", 404);
        }

        const workshopOtherDocuments = await WorkshopOtherDocs.findDocumentsByWorkshopId(workshopId);
        if(workshopOtherDocuments.recordset.length > 0 && workshopOtherDocuments.recordset[0].brochure_id) {
            throwError("Brochure document already exists!", 409);
        }

        let userDetails = await User.findUserById(userId);
        let instituteDetails = await Institute.findDetails(userId);
        let resourcePersonsDetails = await WorkshopResourcePersons.findWorkshopResourcePersonsByWorkshopId(workshopId);
        let workshopImages = await WorkshoPhotos.findWorkshopPhotos(workshopId);

        workshopDetails = workshopDetails.recordset[0];
        userDetails = userDetails.recordset[0];
        instituteDetails = instituteDetails.recordset[0];
        resourcePersonsDetails = resourcePersonsDetails.recordsets[0];
        workshopImages = workshopImages.recordsets[0];

        const payload = {
            "workshop_details": {},
            "speaker_details": [],
            "images_data": []
        };

        payload.workshop_details = {
            title: workshopDetails.title ?? 'N/A',
            begin_date: formatDate(workshopDetails.begin_date) ?? 'N/A',
            end_date: formatDate(workshopDetails.end_date) ?? 'N/A',
            mode: workshopDetails.mode ?? 'N/A',
            participant_intake: workshopDetails.participant_intake ?? 'N/A',
            specialization_area: workshopDetails.area_specialization ?? 'N/A',
            coordinator_name: userDetails.title ? `${userDetails.title} ${userDetails.first_name} ${userDetails.last_name}` : 'N/A',
            coordinator_email_id: userDetails.email_id ?? 'N/A',
            institute_name: instituteDetails.institute_name ?? 'N/A',
            institute_address: `${instituteDetails.institute_address}, ${instituteDetails.district_name ?? ""}, ${instituteDetails.state_name ?? ""}`
        };

        payload.speaker_details = resourcePersonsDetails.map(personDetails => ({
            name: personDetails.person_name ?? 'N/A',
            designation: personDetails.designation ?? 'N/A',
            specialization_area: personDetails.specialization ?? 'N/A',
            email_id: personDetails.email_id ?? 'N/A',
            organization_name: personDetails.organization_name ?? 'N/A'
        }));

        payload.images_data = workshopImages.map(image => base64_encode(image.photo_url) ?? '');

        const body = {
            "document": {
                "document_template_id": `${process.env.PDF_DOCUMENT_TEMPLATE_ID}`,
                "payload":  payload,
                "status": "pending"
            }
        };

        // create brochure from pdf monkey
        fetch('https://api.pdfmonkey.io/api/v1/documents', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.PDF_MONKEY_API_KEY}`
            },
            body: JSON.stringify(body)
        })
        .then(response => {
            return response.json();
        })
        .then(resp => {
            const brochureId = resp.document.id;
            if(workshopOtherDocuments.recordset.length === 0) {
                return WorkshopOtherDocs.addWorkshopBrochure(brochureId, workshopId);
            } 
            else {
                return WorkshopOtherDocs.updateWorkshopBrochure(brochureId, workshopId);
            }
        })
        .then(() => {
            res.status(200).json({
                msg: 'Workshop brochure created successfully!'
            });
        })
        .catch(error => {
            throw error;
        })

    }
    catch(err) {
        next(err);
    }

};