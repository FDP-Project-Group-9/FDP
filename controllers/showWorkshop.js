const Workshop = require("../models/workshop");
const CoordinatorDetails = require("../models/coordinatorDetails");
const Institute = require("../models/institute");
const WorkshopDetails = require("../models/workshopDetails");
const User = require("../models/user");

exports.getWorkshopDetails = async (req, res, next) => {
    const workshopId = req.params['workshop_id'];
    const responseData = {
        coordinator_details: {},
        institute_details: {},
        workshop_details: {},
        co_coordinator_details: {},
    };
    let workshopDetails;

    //find the details of the workshop
    try{
        workshopDetails = await Workshop.getWorkshopDetails(workshopId);
        if(workshopDetails.recordset.length == 0){
            throwError("Workshop not found!", 404);
        }
        workshopDetails = workshopDetails.recordset[0];
        responseData.draft = workshopDetails['draft'];
    }
    catch(err){
        next(err);
    }

    try{
        let result;
        //find the details of coordinator from coordinator_details table
        const coordinatorId = workshopDetails['coordinator_id'];
        result = await CoordinatorDetails.findDetails(coordinatorId);
        const coordinatorDetails = result.recordset[0];
        if(coordinatorDetails){
            responseData['coordinator_details'] = coordinatorDetails;
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