const express = require('express');
const {
    createWorkshopDraft,
    putCoordinatorDetails,
    putInstituteDetails,
    putWorkshopDetails,
    createWorkshop,
    getOTP,
    verifyOTP
} = require('../controllers/createWorkshop');

const { validationErrorHandler } = require("../utils/helper");
const {
     coordinatorDetailsValidations ,
     insituteDetailsValidations,
     workshopDetailsValidations,
     workshopIdValidation
} = require("../middlewares/workshopCreationValidations");

const routes = express.Router();

routes.post("/draft", createWorkshopDraft);

routes.put("/coordinator-details", coordinatorDetailsValidations(), validationErrorHandler, putCoordinatorDetails);

routes.put("/institute-details", insituteDetailsValidations(), validationErrorHandler, putInstituteDetails);

routes.put("/workshop-details", workshopDetailsValidations(), validationErrorHandler, putWorkshopDetails);

routes.get("/otp", getOTP);

routes.post("/verify-otp", workshopIdValidation(), validationErrorHandler, verifyOTP);

routes.put("/", workshopIdValidation(), validationErrorHandler, createWorkshop);

module.exports = routes;