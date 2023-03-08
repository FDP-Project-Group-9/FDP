const WorkshopMediaPhotos = require('../models/workshopMediaPhotos');
const WorkshopPhotos = require('../models/workshopPhotos');
const WorkshopOtherDocs = require('../models/workshopOtherDocs');

const { throwError } = require('../utils/helper');
const { workshop_other_docs, workshop_media_photos, workshop_photos} = require('../utils/constants');

const { WORKSHOP } = require('../utils/constants').fileUploadNames;

const findWorkshopMediaImages = async (workshopId) => {
    try {
        const result = await WorkshopMediaPhotos.findWorkshopMediaPhtotos(workshopId);
        return result.recordsets[0];
    }  
    catch(err) {
        throw err;
    }
};

const findWorkshopPhotos = async (workshopId) => {
    try {
        const result = await WorkshopPhotos.findWorkshopPhotos(workshopId);
        return result.recordsets[0];
    }
    catch(err) {
        throw err;
    }
};

const findWorkshopOtherDocuments = async (workshopId) => {
    try {
        const result = await WorkshopOtherDocs.findDocumentsByWorkshopId(workshopId);
        return result.recordsets[0];
    }
    catch (err) {
        throw err;
    };
};

exports.addWorkshopMediaImages = async (req, res, next) => {  
    try {
        const files = [...req.files[WORKSHOP.MEDIA_IMAGES]];
        const workshopId = req.body['workshop_id'];
    
        const data = {
            files: files,
            workshopId: workshopId
        };

        const existingMediaPhotos = await findWorkshopMediaImages(workshopId);
        if(existingMediaPhotos.length > 5) {
            throwError("More than 5 media images uploaded, delete them first to reupload!", 409);
        }
        else if(existingMediaPhotos.length == 5){
            throwError("Already 5 media images exists, delete them first to reupload!", 409);
        }
        else if(existingMediaPhotos.length > 0) {
            if(files.length + existingMediaPhotos.length > 5){
                throwError("Cannot more than 5 media images on server!", 409);
            }
        }

        const workshopMediaPhotos = new WorkshopMediaPhotos(data);
        await workshopMediaPhotos.addPhotos();
        await findWorkshopOtherDocuments(workshopId);
        res.status(201).json({
            msg: "Workshop media images added succesfully!"
        });
    }
    catch(err){
        next(err);
    }
};

exports.addWorkshopImages = async (req, res, next) => {    
    try {
        const files = [...req.files[WORKSHOP.IMAGES]];
        const workshopId = req.body['workshop_id'];
    
        const data = {
            files: files,
            workshopId: workshopId
        };

        const existingWorkshopPhotos = await findWorkshopPhotos(workshopId);
        if(existingWorkshopPhotos.length > 5) {
            throwError("More than 5 workshop images uploaded, delete them first to reupload!", 409);
        }
        else if(existingWorkshopPhotos.length == 5){
            throwError("Already 5 workshop images exists, delete them first to reupload!", 409);
        }
        else if(existingWorkshopPhotos.length > 0) {
            if(files.length + existingWorkshopPhotos.length > 5){
                throwError("Cannot more than 5 workshop images on server!", 409);
            }
        }

        const workshopPhotos = new WorkshopPhotos(data);
        await workshopPhotos.addWorkshopPhotos();
        res.status(201).json({
            msg: "Workshop images added succesfully!"
        });
    }
    catch(err) {
        next(err);   
    }
};

exports.addWorkshopReport = async (req, res, next) => {
    try{
        const file = req.files[WORKSHOP.REPORT][0];
        const workshopId = req.body['workshop_id'];
    
        const data = {
            fileUrl: file.path,
            workshopId: workshopId
        };

        const workshopOtherDocsDetails = await findWorkshopOtherDocuments(workshopId);
        if(workshopOtherDocsDetails.length > 1) {
            throwError("More than 1 report exists for this workshop, delete them first to reupload!", 409);
        }
        else if(workshopOtherDocsDetails.length == 1) {
            if(workshopOtherDocsDetails[0][workshop_other_docs.colNames.reportUrl]){
                throwError("Report for this workshop already exists, delete them first to reupload!", 409);
            }
            else{
                const reportUrl = file.path;
                const certificateUrl = workshopOtherDocsDetails[0][workshop_other_docs.colNames.certificateUrl];
                const stmtOfExpenditureUrl = workshopOtherDocsDetails[0][workshop_other_docs.colNames.stmtExpenditureUrl];
                await WorkshopOtherDocs.updateOtherDocs(reportUrl, stmtOfExpenditureUrl, certificateUrl, workshopId);
                return res.status(200).json({
                    msg: "Uploaded report for the workshop"
                });
            }
        }

        const workshopOtherDocs = new WorkshopOtherDocs(data);
        await workshopOtherDocs.addWorkshopReport();
        res.status(201).json({
            msg: "Uploaded report for the workshop"
        });
    }
    catch(err) {
        next(err);
    }
};

exports.addWorkshopStmtOfExpenditure = async (req, res, next) => {
    const file = req.files[WORKSHOP.STMT_OF_EXPENDITURE][0];
    const workshopId = req.body['workshop_id'];

    const data = {
        fileUrl: file.path,
        workshopId: workshopId
    };

    try{
        const workshopOtherDocsDetails = await findWorkshopOtherDocuments(workshopId);
        if(workshopOtherDocsDetails.length > 1) {
            throwError("More than 1 statement of expenditure exists for this workshop, delete them first to reupload!", 409);
        }
        else if(workshopOtherDocsDetails.length == 1) {
            if(workshopOtherDocsDetails[0][workshop_other_docs.colNames.stmtExpenditureUrl]){
                throwError("Statement of expenditure for this workshop already exists, delete them first to reupload!", 409);
            }
            else{
                const reportUrl = workshopOtherDocsDetails[0][workshop_other_docs.colNames.reportUrl];
                const certificateUrl = workshopOtherDocsDetails[0][workshop_other_docs.colNames.certificateUrl];
                const stmtOfExpenditureUrl = file.path;
                await WorkshopOtherDocs.updateOtherDocs(reportUrl, stmtOfExpenditureUrl, certificateUrl, workshopId);
                return res.status(200).json({
                    msg: "Uploaded Statement of expenditure for the workshop"
                });
            }
        }

        const workshopOtherDocs = new WorkshopOtherDocs(data);
        await workshopOtherDocs.addWorkshopReport();
        res.status(201).json({
            msg: "Uploaded report for the workshop"
        });
    }
    catch(err) {
        next(err);
    }
};