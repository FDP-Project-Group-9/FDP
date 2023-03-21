const Workshop = require('../models/workshop');
const WorkshopOtherDocs = require('../models/workshopOtherDocs');

const { throwError } = require('../utils/helper');

exports.checkIfWorkshopExists = async (req, res, next) => {
    const workshopId = req.body['workshop_id'];
    // console.log(res.locals.workshop);
    try {
        const workshopDetails = await Workshop.getWorkshopDetails(workshopId);
        if(workshopDetails.recordset.length == 0){
            throwError("Workshop not found!", 404);
        }
        res.locals.workshop = workshopDetails.recordset[0];
        next();
    }
    catch(err) {
        next(err);
    }
};
