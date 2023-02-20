const express = require('express');
const { addWorkshopSpecialization, getWorkshopSpecializations } = require('../controllers/workshopSpecialization');
const { verifyCoordinatorRole } = require('../middlewares/userAuthorization');
const { addWorkshopSpecializationValidations } = require("../middlewares/workshopSpecializationValidations");
const { validationErrorHandler } = require('../utils/utils');
const createWorkshopRoutes = require('./createWorkshop');

const routes = express.Router();

// routes for creating workshop
routes.use("/create-workshop", verifyCoordinatorRole, createWorkshopRoutes);

// workshop specializations routes
routes.post("/specialization", verifyCoordinatorRole, addWorkshopSpecializationValidations(), validationErrorHandler, addWorkshopSpecialization);
routes.get("/specializations", verifyCoordinatorRole, getWorkshopSpecializations);

module.exports = routes;
