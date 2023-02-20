const Workshop = require("../models/workshop");
const User = require("../models/user");

exports.createWorkshopDraft = async (req, res, next) => {
    const userId = req.body['user_id'];
    const workshop = new Workshop(userId);

    try {
        const result = await workshop.createWorkshop();
        const workshopId = result.recordset[0][''];
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

exports.getWorkshopDraft = async (req, res, next) => {

};
