const express = require('express');
const {
    getWorkshopDraft,
    createWorkshopDraft,
    putCoordinatorDetails,
    putInstituteDetails
} = require('../controllers/createWorkshop');

const { validationErrorHandler } = require("../utils/utils");
const {
     coordinatorDetailsValidations ,
     insituteDetailsValidations
} = require("../middlewares/workshopCreationValidations");

const routes = express.Router();

routes.post("/draft", createWorkshopDraft);

routes.get("/draft", getWorkshopDraft);

routes.put("/coordinator-details", coordinatorDetailsValidations(), validationErrorHandler, putCoordinatorDetails);

routes.put("/institute-details", insituteDetailsValidations(), validationErrorHandler, putInstituteDetails);

module.exports = routes;