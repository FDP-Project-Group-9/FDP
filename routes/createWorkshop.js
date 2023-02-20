const express = require('express');
const {
    getWorkshopDraft,
    createWorkshopDraft
} = require('../controllers/createWorkshop');

const { verifyUserRole } = require("../middlewares/workshopAuthorization");
const { validationErrorHandler } = require("../utils/utils");
const { createWorkshopValidationRules } = require("../middlewares/workshopValidations");

const routes = express.Router();

routes.post("/create-draft", createWorkshopValidationRules(), validationErrorHandler, verifyUserRole, createWorkshopDraft);

routes.get("/get-draft", getWorkshopDraft);

module.exports = routes;