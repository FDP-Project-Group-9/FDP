const express = require('express');

const createWorkshopRoutes = require('./createWorkshop');
const uploadWorkshopFilesRoutes = require('./workshopUploads');

const { addWorkshopSpecialization, getWorkshopSpecializations } = require('../controllers/workshopSpecialization');
const { verifyCoordinatorRole, verifyAdministratorRole } = require('../middlewares/userAuthorization');
const { addWorkshopSpecializationValidations } = require("../middlewares/workshopSpecializationValidations");
const { getWorkshopDetails, getAllWorkshops, getUserWorkshops } = require("../controllers/showWorkshop")
const { validationErrorHandler } = require('../utils/helper');
const { approveWorkshop } = require('../controllers/createWorkshop');
const { workshopIdValidation } = require('../middlewares/workshopCreationValidations');

const routes = express.Router();

// routes for creating workshop
routes.use("/create-workshop", verifyCoordinatorRole, createWorkshopRoutes);

//routes for uploading workshop files
routes.use("/upload", verifyCoordinatorRole, uploadWorkshopFilesRoutes);

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
