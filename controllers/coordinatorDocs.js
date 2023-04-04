const fs = require("fs");

const User = require("../models/user");
const CoordinatorDocs = require("../models/coordinatorDocs");

const { USER } = require("../utils/constants").fileUploadNames;
const { throwError } = require("../utils/helper");
const { emailGenerator } = require("../config/email");
const { removeFileByPath } = require("../config/fileDirectory");
const { roles } = require("../utils/constants");
const { colNames } = require("../utils/constants").user_docs; 

exports.uploadRegistrationDoc = async (req, res, next) => { 
    const emailId = req.body['email_id'];
    const file = req.files[USER.REGISTRATION_DOC][0];
    const attachments = {
        path: file.path,
        contentType: file.mimetype,
    };

    try{
        //check if the user exists or not
        const user = await User.findUserByEmail(emailId);
        if(user.recordset.length == 0){
            throwError("User not found!", 404);
        }
        //check if the user is coordinator or not
        else if(user.recordset[0]['role_name'] != roles.COORDINATOR) {
            throwError("Only coordinators are required to upload registration document! Please Login.", 400);
        }

        const userId = user.recordset[0]['user_id'];
        //find if the doc is already present
        let existingCoordinatorDocs = await CoordinatorDocs.findCoordinatorDocs(userId);

        //if the doc is already present then throw an error
        if(existingCoordinatorDocs.recordset.length > 0) {
            throwError("Cannot upload more than one registration doc!", 413);
        }
        else {
            const coordinatorDocs = new CoordinatorDocs({
                [colNames.userId]: userId,
                [colNames.registrationDocUrl]: file.path
            });
            await coordinatorDocs.addRegistrationDocForUser();
        }
        res.status(200).json({msg: "Files uploaded successfully!"});

        try{
            const admins = await User.findAllAdministrators();
            const userEmailId = user.recordset[0]["email_id"];
            const userName = user.recordset[0]["first_name"] + " " + user.recordset[0]["last_name"];
            const adminEmails = admins.recordset.map(record => record["email_id"]).join(', ');
            const subject = "Coordinator registration verification required!";
            const content = `
                <h3>Coordinator registration Verification Required!</h3>
                <p>Please find the attached documents to verify the coordinator
                 <b>${userName}<b> (${userEmailId}).
                </p>
            `;
            emailGenerator(adminEmails, subject, content, attachments);
        }
        catch(err){
            next(err);
        }
    }
    catch(err){
        next(err);
    }
};

exports.updateMandateDocs = async (req, res, next) => {
    const userId = res.locals.user.user_id;
    const coordinatorMandateFormFile = req.files && req.files[USER.COORDINATOR_MANDATE_FORM] ? req.files[USER.COORDINATOR_MANDATE_FORM][0] : null;
    const coordinatorPhotoFile = req.files && req.files[USER.COORDINATOR_PHOTO] ? req.files[USER.COORDINATOR_PHOTO][0] :null;
    const coordinatorSignatureFile = req.files && req.files[USER.COORDINATOR_SIGNATURE] ? req.files[USER.COORDINATOR_SIGNATURE][0] : null;
    const instituteLogoFile = req.files && req.files[USER.INSTITUTE_LOGO] ? req.files[USER.INSTITUTE_LOGO][0] : null;
    
    try {
        const existingCoordinatorDocs = await CoordinatorDocs.findCoordinatorDocs(userId);
        if(existingCoordinatorDocs.recordset.length == 0){
            throwError("Registration Document not found! Registration Document is required", 404);
        }
        let data = {...existingCoordinatorDocs.recordset[0]};

        if(coordinatorMandateFormFile?.path) {
            if(data[colNames.coordinatorMandateUrl]) {
                removeFileByPath(data[colNames.coordinatorMandateUrl]);
            }
            data = {...data, [colNames.coordinatorMandateUrl]: coordinatorMandateFormFile.path}
        }
        if(coordinatorPhotoFile?.path){
            if(data[colNames.coordinatorPhotoUrl]) {
                removeFileByPath(data[colNames.coordinatorPhotoUrl]);
            }
            data = {...data, [colNames.coordinatorPhotoUrl]: coordinatorPhotoFile.path};
        }
        if(coordinatorSignatureFile?.path){
            if(data[colNames.coordinatorSignatureUrl]) {
                removeFileByPath(data[colNames.coordinatorSignatureUrl]);
            }
            data = {...data, [colNames.coordinatorSignatureUrl]: coordinatorSignatureFile.path};
        }
        if(instituteLogoFile?.path){
            if(data[colNames.instituteLogoUrl]){
                removeFileByPath(data[colNames.instituteLogoUrl]);
            }   
            data = {...data, [colNames.instituteLogoUrl]: instituteLogoFile.path};
        }

        await CoordinatorDocs.updateCoordinatorDocs(data);
        res.status(200).json({
            msg: "Documents updated!"
        });
    }
    catch(err) {
        next(err);
    }
};

exports.deleteMandateDocs = async (req, res, next) => {
    const userId = res.locals.user.user_id;
    const deleteCoordinatorMandateForm = req.body.mandate_form ?? null;
    const deleteCoordinatorPhoto = req.body.photo ?? null;
    const deleteCoordinatorSignature = req.body.signature ?? null;
    const deleteInstituteLogo = req.body.institute_logo ?? null;

    try {
        const existingCoordinatorDocs = await CoordinatorDocs.findCoordinatorDocs(userId);
        const data = {...existingCoordinatorDocs.recordset[0]};
        if( deleteCoordinatorMandateForm ){
            if(!data[colNames.coordinatorMandateUrl])
                throwError("Coordinator Mandate form not found!", 404);
            else{
                removeFileByPath(data[colNames.coordinatorMandateUrl]);
                data[colNames.coordinatorMandateUrl] = null;
            }
        }
        if(deleteCoordinatorPhoto) {
            if(!data[colNames.coordinatorPhotoUrl])
                throwError("Coordinator Photo not found!", 404);
            else {
                removeFileByPath(data[colNames.coordinatorPhotoUrl]);
                data[colNames.coordinatorPhotoUrl] = null;
            }
        }
        if(deleteCoordinatorSignature) {
            if(!data[colNames.coordinatorSignatureUrl])
                throwError("Coordinator signature not found!", 404);
            else{
                removeFileByPath(data[colNames.coordinatorSignatureUrl]);
                data[colNames.coordinatorSignatureUrl] = null;
            }
        }
        if(deleteInstituteLogo) {
            if(!data[colNames.instituteLogoUrl])
                throwError("Institute logo not found!", 404);
            else {
                removeFileByPath(data[colNames.instituteLogoUrl]);
                data[colNames.instituteLogoUrl] = null;
            }
        }
        await CoordinatorDocs.updateCoordinatorDocs(data);
        res.status(200).json({
            msg: "Successfully deleted file!"
        });
    }
    catch(err) {
        next(err);
    }
};

exports.getRegistrationDoc = async (req, res, next) => {
    const userId = Number(req.query.user_id);
    
    try {
        const coordinatorDocs = await CoordinatorDocs.findCoordinatorDocs(userId);
        if(coordinatorDocs.recordset.length == 0){
            throwError("Document not found!", 404);
        }
        const registrationDocUrl = coordinatorDocs.recordset[0][colNames.registrationDocUrl];
        const stream = fs.createReadStream(registrationDocUrl);
        stream.on('error', () => {
           return res.status(404).json({
            errors: [
                {
                    msg: "Could not find the file on server!",
                    status: 404
                }
            ]
           }); 
        });
        const fileType = registrationDocUrl.split('.').slice(-1);
        let contentType = 'application/pdf';

        if(fileType?.length > 0 && fileType[0] === 'png')
            contentType = 'image/png';
        else if(fileType?.length > 0 && fileType[0] === 'jpeg') 
            contentType = 'image/jpeg';

        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Disposition', 'attachment');
        stream.pipe(res);
    }
    catch(err){
        next(err);
    }
};