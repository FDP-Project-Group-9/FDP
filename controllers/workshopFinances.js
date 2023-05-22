const WorkshopDetails = require("../models/workshopDetails");

exports.updateWorkshopFinance = async (req, res, next) => {
    const workshopId = req.body.workshop_id;
    const allotedFunds = req.body.alloted_funds;
    const expenditure = req.body.expenditure;

    try {
        await WorkshopDetails.updateFinanceDetails(workshopId, allotedFunds, expenditure);
        return res.status(201).json({
            msg: "Finance details updated!"
        });
    }
    catch(err) {
        next(err);
    }
};

exports.getWorkshopFinanceDetails = async (req, res, next) => {
    const month = req.query.month;
    const year = req.query.year;
    const coordinatorId = req.query.coordinator_id;
    const maxBudget = req.query.max_budget;
    const areaSpecializationId = req.query.area_specialization_id;

    try {
        const response = await WorkshopDetails.getWorkshopsFinanceReport(month, year, coordinatorId, maxBudget, areaSpecializationId);
        res.status(200).json({
            data: response.recordset
        });
    }
    catch(err) {
        next(err);
    }
};