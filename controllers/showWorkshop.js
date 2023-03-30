const Workshop = require("../models/workshop");
const CoordinatorDetails = require("../models/coordinatorDetails");
const Institute = require("../models/institute");
const WorkshopDetails = require("../models/workshopDetails");
const WorkshopMediaPhotos = require("../models/workshopMediaPhotos");
const WorkshopOtherDocs = require("../models/workshopOtherDocs");
const WorkshopPhotos = require("../models/workshopPhotos");
const User = require("../models/user");

const { throwError, getAllResults, getFirstResult } = require("../utils/helper");

exports.getWorkshopDetails = async (req, res, next) => {
    const workshopId = req.params['workshop_id'];
    const responseData = {
        coordinator_details: {},
        institute_details: {},
        workshop_details: {},
        co_coordinator_details: {},
        files_url: {
            media_photos: [],
            workshop_photos: [],
            other_docs: {
                report: null,
                stmt_expenditure: null,
                certificate: null
            }
        }
    };
    let workshopDetails;

    //find the details of the workshop
    try{
        let result;
        workshopDetails = await Workshop.getWorkshopDetails(workshopId);
        if(workshopDetails.recordset.length == 0){
            throwError("Workshop not found!", 404);
        }
        workshopDetails = workshopDetails.recordset[0];
        responseData.draft = workshopDetails['draft'];
        responseData.otp_verified = workshopDetails['otp_verified'];

        //find the details of coordinator from coordinator_details table
        const coordinatorId = workshopDetails['coordinator_id'];
        result = await User.findUserById(coordinatorId);
        let coordinatorDetails = result.recordset[0];
        if(coordinatorDetails){
            delete coordinatorDetails['password'];
            responseData['coordinator_details'] = coordinatorDetails;
        }
        result = await CoordinatorDetails.findDetails(coordinatorId);
        coordinatorDetails = result.recordset[0];
        if(coordinatorDetails){
            responseData['coordinator_details'] = { ...responseData['coordinator_details'], ...coordinatorDetails};
        }

        //find the institute details of workshop from the institute details table
        const instituteId = workshopDetails['institute_id'];
        result = await Institute.findDetailsById(instituteId);
        const instituteDetails = result.recordset[0];
        if(instituteDetails){
            responseData['institute_details'] = instituteDetails;
        }

        //find the workshop details from workshop_details table
        const workshopDetailsId = workshopDetails['workshop_details_id'];
        result = await WorkshopDetails.getDetailsById(workshopDetailsId);
        const workshopDetailsObj = result.recordset[0];
        if(workshopDetailsObj){
            responseData['workshop_details'] = workshopDetailsObj;
        }

        //find the co-coordinator details
        const coCoordinatorId = workshopDetails['co_coordinator_id'];
        result = await User.findUserById(coCoordinatorId);
        const coCoordinatorDetails = result.recordset[0];
        if(coCoordinatorDetails){
            delete coCoordinatorDetails['password'];
            responseData['co_coordinator_details'] = coCoordinatorDetails;
        }

        //finding the files associated with the workshop
        const workshopMediaPhotos = await WorkshopMediaPhotos.findWorkshopMediaPhtotos(workshopId);
        result = getAllResults(workshopMediaPhotos);
        responseData['files_url']['media_photos'] = result.map(file => file['media_photo_url']);

        const workshopPhotos = await WorkshopPhotos.findWorkshopPhotos(workshopId);
        result = getAllResults(workshopPhotos);
        responseData['files_url']['workshop_photos'] = result.map(file => file['photo_url']);

        const workshopOtherDocs = await WorkshopOtherDocs.findDocumentsByWorkshopId(workshopId);
        result = getFirstResult(workshopOtherDocs);
        
        if(result) {
            responseData['files_url']['other_docs']['report'] = result['report_url'];
            responseData['files_url']['other_docs']['certificate'] = result['certificate_url'];
            responseData['files_url']['other_docs']['stmt_expenditure'] = result['stmt_expenditure_url'];
        }

        res.status(200).json({
            msg: "Workshop details successfully fetched!",
            data: responseData
        });
    }
    catch(err){
        next(err);
        return;
    }

};

exports.getAllWorkshops = async (req, res, next) => {
    // status can be completed, ongoing, upcoming
    const status = req.query.status;
    // approved could be true or false
    const approved = req.query.approved;
    
    let responseData;
  
    try{
        const workshops = await Workshop.getAllWorkshops(status, approved);
        responseData = workshops.recordsets[0];
        res.status(200).json({
            data: responseData
        });
    }
    catch(err){
        next(err);
    }
};

exports.getUserWorkshops = async (req, res, next) => {
    const incomplete = req.query.incomplete;
    const user = res.locals.user;
    const userId = user['user_id'];
    const pageNo = Number(req.query.page_no || '0');
    const perPage = Number(req.query.per_page || '10');

    let responseData;
    try{
        const offset = (pageNo - 1) * perPage;  
        const workshopDetails = await Workshop.getAllUserWorkshops(userId, incomplete, offset, perPage);
        responseData = workshopDetails[0].recordsets[0];
        const totalWorkshopsCount = workshopDetails[1].recordset[0].total_rows;
        res.status(200).json({
            data: {
                workshops: responseData,
                total_workshops_count: totalWorkshopsCount
            }
        });
    }
    catch(err){
        next(err);
    }
};