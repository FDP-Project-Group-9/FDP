const express = require('express');
const { addWorkshopSpecialization, getWorkshopSpecializations } = require('../controllers/workshopSpecialization');
const { verifyCoordinatorRole } = require('../middlewares/userAuthorization');
const { addWorkshopSpecializationValidations } = require("../middlewares/workshopSpecializationValidations");
const { getWorkshopDetails } = require("../controllers/showWorkshop")
const { validationErrorHandler } = require('../utils/helper');
const createWorkshopRoutes = require('./createWorkshop');

const routes = express.Router();

// routes for creating workshop
routes.use("/create-workshop", verifyCoordinatorRole, createWorkshopRoutes);

//get workshop details
routes.get("/:workshop_id", getWorkshopDetails);

// workshop specializations routes
routes.post("/specialization", verifyCoordinatorRole, addWorkshopSpecializationValidations(), validationErrorHandler, addWorkshopSpecialization);
routes.get("/specializations", verifyCoordinatorRole, getWorkshopSpecializations);

module.exports = routes;
