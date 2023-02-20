const express = require('express');
const {
    createWorkshopDraft,
    putCoordinatorDetails,
    putInstituteDetails,
    putWorkshopDetails
} = require('../controllers/createWorkshop');

const { validationErrorHandler } = require("../utils/helper");
const {
     coordinatorDetailsValidations ,
     insituteDetailsValidations,
     workshopDetailsValidations
} = require("../middlewares/workshopCreationValidations");

const routes = express.Router();

routes.post("/draft", createWorkshopDraft);

routes.put("/coordinator-details", coordinatorDetailsValidations(), validationErrorHandler, putCoordinatorDetails);

routes.put("/institute-details", insituteDetailsValidations(), validationErrorHandler, putInstituteDetails);

routes.put("/workshop-details", workshopDetailsValidations(), validationErrorHandler, putWorkshopDetails);

module.exports = routes;