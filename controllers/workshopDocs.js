const fetch = (...args) =>
	import('node-fetch').then(({default: fetch}) => fetch(...args));
const fs = require('fs');

const WorkshopMediaPhotos = require('../models/workshopMediaPhotos');
const WorkshopPhotos = require('../models/workshopPhotos');
const WorkshopOtherDocs = require('../models/workshopOtherDocs');

const { throwError } = require('../utils/helper');
const { workshop_other_docs, workshop_photos, workshop_media_photos } = require('../utils/constants');
const { removeFileByPath } = require('../config/fileDirectory');

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

exports.deleteWorkshopImage = async (req, res, next) => {
    const fileId = req.body['file_id'];
    const workshopId = req.body['workshop_id'];
    try {
        const fileDetails = await WorkshopPhotos.findFileById(fileId, workshopId);
        if(fileDetails.recordset.length == 0){
            throwError("File not found!", 404);
        }

        removeFileByPath(fileDetails.recordset[0][workshop_photos.colNames.photoUrl]);

        await WorkshopPhotos.deleteWorkshopPhotos(fileId, workshopId);
        res.status(200).json({
            msg: "File deleted successfully!"
        });
    }
    catch(err) {
        next(err);
    }
};

exports.deleteWorkshopMediaImage = async (req, res, next) => {
    const fileId = req.body['file_id'];
    const workshopId = req.body['workshop_id'];

    try {
        const fileDetails = await WorkshopMediaPhotos.findWorkshopMediaImageById(fileId, workshopId);
        if(fileDetails.recordset.length == 0){
            throwError("File not found!", 404);
        }

        removeFileByPath(fileDetails.recordset[0][workshop_media_photos.colNames.mediaPhotoUrl]);

        await WorkshopMediaPhotos.deleteMediaPhotos(fileId, workshopId);
        res.status(200).json({
            msg: "File deleted successfully!"
        });
    }
    catch(err) {
        next(err);
    }
};

exports.deleteWorkshopReport = async (req, res, next) => {
    const fileId = req.body['file_id'];
    const workshopId = req.body['workshop_id'];

    try {
        const fileDetails = await WorkshopOtherDocs.findDocumentsByWorkshopId(workshopId);
        if(fileDetails.recordset.length == 0 || !fileDetails.recordset[0][workshop_other_docs.colNames.reportUrl]){
            throwError("File not found!", 404);
        }

        removeFileByPath(fileDetails.recordset[0][workshop_other_docs.colNames.reportUrl]);

        await WorkshopOtherDocs.deleteWorkshopReport(fileId, workshopId);
        res.status(200).json({
            msg: "File deleted successfully!"
        });
    }
    catch(err) {
        next(err);
    }
};

exports.deleteWorkshopCertificate = async (req, res, next) => {
    const fileId = req.body['file_id'];
    const workshopId = req.body['workshop_id'];

    try {
        const fileDetails = await WorkshopOtherDocs.findDocumentsByWorkshopId(workshopId);
        if(fileDetails.recordset.length == 0 || !fileDetails.recordset[0][workshop_other_docs.colNames.certificateUrl]){
            throwError("File not found!", 404);
        }

        removeFileByPath(fileDetails.recordset[0][workshop_other_docs.colNames.certificateUrl]);

        await WorkshopOtherDocs.deleteWorkshopCertificate(fileId, workshopId);
        res.status(200).json({
            msg: "File deleted successfully!"
        });
    }
    catch(err) {
        next(err);
    }
};

exports.deleteWorkshopStmtOfExpenditure = async (req, res, next) => {
    const fileId = req.body['file_id'];
    const workshopId = req.body['workshop_id'];

    try {
        const fileDetails = await WorkshopOtherDocs.findDocumentsByWorkshopId(workshopId);
        if(fileDetails.recordset.length == 0 || !fileDetails.recordset[0][workshop_other_docs.colNames.stmtExpenditureUrl]){
            throwError("File not found!", 404);
        }

        removeFileByPath(fileDetails.recordset[0][workshop_other_docs.colNames.stmtExpenditureUrl]);

        await WorkshopOtherDocs.deleteWorkshopStmtOfExpenditure(fileId, workshopId);
        res.status(200).json({
            msg: "File deleted successfully!"
        });
    }
    catch(err) {
        next(err);
    }
};

exports.deleteWorkshopBrochure = async (req, res, next) => {
    const fileId = req.body['file_id'];
    const workshopId = req.body['workshop_id'];

    try {
        const fileDetails = await WorkshopOtherDocs.findDocumentsByWorkshopId(workshopId);
        if(fileDetails.recordset.length == 0 || !fileDetails.recordset[0][workshop_other_docs.colNames.brochureUrl]){
            throwError("File not found!", 404);
        }

        await WorkshopOtherDocs.deleteWorkshopBrochure(fileId, workshopId);

        const brochureFileId = fileDetails.recordset[0][workshop_other_docs.colNames.brochureUrl];
        fetch(`https://api.pdfmonkey.io/api/v1/documents/${brochureFileId}`, {
            method: 'delete',
            headers: {
                'Authorization': `Bearer ${process.env.PDF_MONKEY_API_KEY}`
            }
        })
        .then(() => {
            res.status(200).json({
                msg: "File deleted successfully!"
            });
        })
        .catch(err => {
            throw err;
        });
    }
    catch(err) {
        next(err);
    }
};

exports.getWorkshopMediaImage = async (req, res, next) => {
    const fileId = req.params.fileId;

    try {
        const result = await WorkshopMediaPhotos.findWorkshopMediaImageById(fileId);
        if(result.recordset.length == 0) {
            throwError("Could not find the file", 404);
        }
        const mediaPhotoUrl = result.recordset[0].media_photo_url;
        if(!mediaPhotoUrl) {
            throwError("Image not found!", 404);
        }
        const stream = fs.createReadStream(mediaPhotoUrl);
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
        const fileType = mediaPhotoUrl.split('.').slice(-1);
        let contentType = 'application/pdf';

        if(fileType?.length > 0 && fileType[0] === 'png')
            contentType = 'image/png';
        else if(fileType?.length > 0 && (fileType[0] === 'jpg' || fileType[0] === 'jpeg')) 
            contentType = 'image/jpeg';

        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Disposition', 'attachment');
        stream.pipe(res);
    }
    catch(err) {
        console.log(err);
        next(err);
    }
};

exports.getWorkshopImage = async (req, res, next) => {
    const fileId = req.params.fileId;

    try {
        const result = await WorkshopPhotos.findFileById(fileId);
        if(result.recordset.length == 0) {
            throwError("Could not find the file", 404);
        }
        const workshopPhotoUrl = result.recordset[0].photo_url;
        if(!workshopPhotoUrl) {
            throwError("Image not found!", 404);
        }
        const stream = fs.createReadStream(workshopPhotoUrl);
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
        const fileType = workshopPhotoUrl.split('.').slice(-1);
        let contentType = 'application/pdf';

        if(fileType?.length > 0 && fileType[0] === 'png')
            contentType = 'image/png';
        else if(fileType?.length > 0 && (fileType[0] === 'jpg' || fileType[0] === 'jpeg')) 
            contentType = 'image/jpeg';

        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Disposition', 'attachment');
        stream.pipe(res);
    }
    catch(err) {
        next(err);
    }
};

exports.getWorkshopReport = async (req, res, next) => {
    const fileId = req.params.fileId;

    try {
        const result = await WorkshopOtherDocs.findDocumentsByFileId(fileId);
        if(result.recordset.length == 0) {
            throwError("Could not find the file", 404);
        }
        const workshopReportUrl = result.recordset[0].report_url;
        if(!workshopReportUrl) {
            throwError("Document not found!", 404);
        }
        const stream = fs.createReadStream(workshopReportUrl);
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
        const fileType = workshopReportUrl.split('.').slice(-1);
        let contentType = 'application/pdf';

        if(fileType?.length > 0 && fileType[0] === 'png')
            contentType = 'image/png';
        else if(fileType?.length > 0 && (fileType[0] === 'jpg' || fileType[0] === 'jpeg')) 
            contentType = 'image/jpeg';

        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Disposition', 'attachment');
        stream.pipe(res);
    }
    catch(err) {
        next(err);
    }
};

exports.getWorkshopStmtOfExpenditure = async (req, res, next) => {
    const fileId = req.params.fileId;

    try {
        const result = await WorkshopOtherDocs.findDocumentsByFileId(fileId);
        if(result.recordset.length == 0) {
            throwError("Could not find the file", 404);
        }
        const workshopStmtOfExpenditureUrl = result.recordset[0].stmt_expenditure_url;
        if(!workshopStmtOfExpenditureUrl) {
            throwError("Document not found!", 404);
        }
        
        const stream = fs.createReadStream(workshopStmtOfExpenditureUrl);
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
        const fileType = workshopStmtOfExpenditureUrl.split('.').slice(-1);
        let contentType = 'application/pdf';

        if(fileType?.length > 0 && fileType[0] === 'png')
            contentType = 'image/png';
        else if(fileType?.length > 0 && (fileType[0] === 'jpg' || fileType[0] === 'jpeg')) 
            contentType = 'image/jpeg';

        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Disposition', 'attachment');
        stream.pipe(res);
    }
    catch(err) {
        next(err);
    }
};

exports.getWorkshopCertificate = async (req, res, next) => {
    try {
        const workshopCertificateUrl = `D:\\FINAL YEAR PROJECT\\fdp-backend\\files\\workshop-docs\\certificate\\FDP-Certificate.png`;
        if(!workshopCertificateUrl) {
            throwError("Document not found!", 404);
        }
        const stream = fs.createReadStream(workshopCertificateUrl);
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
        const fileType = workshopCertificateUrl.split('.').slice(-1);
        let contentType = 'application/pdf';

        if(fileType?.length > 0 && fileType[0] === 'png')
            contentType = 'image/png';
        else if(fileType?.length > 0 && (fileType[0] === 'jpg' || fileType[0] === 'jpeg')) 
            contentType = 'image/jpeg';

        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Disposition', 'attachment');
        stream.pipe(res);
    }
    catch(err) {
        next(err);
    }
};

exports.getWorkshopBrochure = async (req, res, next) => {
    const fileId = req.params.fileId;

    try {
        const result = await WorkshopOtherDocs.findDocumentsByFileId(fileId);
        if(result.recordset.length == 0) {
            throwError("Could not find the file", 404);
        }
        const workshopBrochureId = result.recordset[0].brochure_id;
        if(!workshopBrochureId) {
            throwError("Document not found!", 404);
        }
        fetch(`https://api.pdfmonkey.io/api/v1/document_cards/${workshopBrochureId}`, {
            method: 'get',
            headers: {
                'Authorization': `Bearer ${process.env.PDF_MONKEY_API_KEY}`
            }
        })
        .then(response => response.json())
        .then(response => {
            if(response.errors && response.errors[0].status == 404) {
                return res.status(404).json({
                    errors: [
                        {
                            msg: "File has been expired, please delete the file and generate again!",
                            status: 404
                        }
                    ]
                });
            }
            const url = response.document_card.download_url;
            res.status(200).json({
                msg: "Document fetched!",
                data: {
                    url: url
                }
            });
        })
        .catch(err => { throw err });
    }
    catch(err) {
        // console.log(err);
        next(err);
    }
};
