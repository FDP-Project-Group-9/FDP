const express = require('express');
const {
    getWorkshopDraft,
    createWorkshopDraft,
    putCoordinatorDetails
} = require('../controllers/createWorkshop');

const { validationErrorHandler } = require("../utils/utils");
const {
     addCoordinatorDetailsValidations 
} = require("../middlewares/workshopCreationValidations");

const routes = express.Router();

routes.post("/draft", createWorkshopDraft);

routes.get("/draft", getWorkshopDraft);

routes.put("/coordinator-details", addCoordinatorDetailsValidations(), validationErrorHandler, putCoordinatorDetails);

module.exports = routes;