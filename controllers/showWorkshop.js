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
            other_docs_id: null
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
        responseData['files_url']['media_photos'] = result.map(file => ({id: file.id}));

        const workshopPhotos = await WorkshopPhotos.findWorkshopPhotos(workshopId);
        result = getAllResults(workshopPhotos);
        responseData['files_url']['workshop_photos'] = result.map(file => ({id: file.id}));

        const workshopOtherDocs = await WorkshopOtherDocs.findDocumentsByWorkshopId(workshopId);
        result = getFirstResult(workshopOtherDocs);
        
        responseData['files_url']['other_docs_id'] = result?.id ?? null;

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
    const timeline_status = req.query.timeline_status;
    // workshopApprovalStatus could be true or false
    const workshopApprovalStatus = req.query.workshop_approval_status;
    // query param that tells whether the request user is admin or not
    const isUserAdmin = req.query.is_admin?.toLowerCase() === 'true' ? true : false;
    // no of enteries per api call
    const perPage = Number(req.query.per_page ?? 10);
    const pageNo = Number(req.query.page_no ?? 1);

    let responseData;
    const offset = (pageNo - 1)*perPage;
    try{
        const workshopsResponse = await Workshop.getAllWorkshops(offset, perPage, timeline_status, workshopApprovalStatus, isUserAdmin);
        responseData = workshopsResponse[0].recordsets[0];
        res.status(200).json({
            data: {
                workshops: responseData,
                total_workshops_count: workshopsResponse[1].recordset[0].total_count
            }
        });
    }
    catch(err){
        next(err);
    }
};

exports.getUserWorkshops = async (req, res, next) => {
    const draft = req.query.draft;
    const workshop_approval_status = req.query.workshop_approval_status;
    const timeline_status = req.query.timeline_status;
    const user = res.locals.user;
    const userId = user['user_id'];
    const pageNo = Number(req.query.page_no ?? 1);
    const perPage = Number(req.query.per_page ?? 10);

    let responseData;
    try{
        const offset = (pageNo - 1) * perPage;  
        const workshopDetails = await Workshop.getAllUserWorkshops(offset, perPage, userId, draft, workshop_approval_status, timeline_status);
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