const express = require('express');
const { addWorkshopSpecialization, getWorkshopSpecializations } = require('../controllers/workshopSpecialization');
const { verifyCoordinatorRole, verifyAdministratorRole } = require('../middlewares/userAuthorization');
const { addWorkshopSpecializationValidations } = require("../middlewares/workshopSpecializationValidations");
const { getWorkshopDetails, getAllWorkshops, getUserWorkshops } = require("../controllers/showWorkshop")
const { validationErrorHandler } = require('../utils/helper');
const createWorkshopRoutes = require('./createWorkshop');
const { approveWorkshop } = require('../controllers/createWorkshop');
const { workshopIdValidation } = require('../middlewares/workshopCreationValidations');

const routes = express.Router();

// routes for creating workshop
routes.use("/create-workshop", verifyCoordinatorRole, createWorkshopRoutes);

// workshop specializations routes
routes.post("/specialization", verifyCoordinatorRole, addWorkshopSpecializationValidations(), validationErrorHandler, addWorkshopSpecialization);
routes.get("/specializations", verifyCoordinatorRole, getWorkshopSpecializations);

// approve workshop
routes.put("/approve", verifyAdministratorRole, workshopIdValidation(), validationErrorHandler, approveWorkshop);

//get workshop details
routes.get("/user-workshops", verifyCoordinatorRole, getUserWorkshops);
routes.get("/:workshop_id", getWorkshopDetails);

routes.get("/",getAllWorkshops);

module.exports = routes;
