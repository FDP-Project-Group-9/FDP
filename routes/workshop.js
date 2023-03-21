const express = require('express');

const createWorkshopRoutes = require('./createWorkshop');
const uploadWorkshopFilesRoutes = require('./workshopUploads');
const deleteWorkshopFilesRoutes = require('./workshopDeleteFile');

const { addWorkshopSpecialization, getWorkshopSpecializations } = require('../controllers/workshopSpecialization');
const { verifyCoordinatorRole, verifyAdministratorRole } = require('../middlewares/userAuthorization');
const { addWorkshopSpecializationValidations } = require("../middlewares/workshopSpecializationValidations");
const { getWorkshopDetails, getAllWorkshops, getUserWorkshops } = require("../controllers/showWorkshop")
const { validationErrorHandler } = require('../utils/helper');
const createWorkshopRoutes = require('./createWorkshop');
const quizRoutes=require('./quiz');
const { approveWorkshop } = require('../controllers/createWorkshop');
const { workshopIdValidation } = require('../middlewares/workshopCreationValidations');
const { checkIfWorkshopExists } = require('../middlewares/workshop');

const routes = express.Router();

// routes for creating workshop
routes.use("/create-workshop", verifyCoordinatorRole, createWorkshopRoutes);

//routes for uploading workshop files
routes.use("/upload", verifyCoordinatorRole, uploadWorkshopFilesRoutes);

//routes for deleting workshop files
routes.use("/delete", verifyCoordinatorRole, checkIfWorkshopExists, deleteWorkshopFilesRoutes);

// workshop specializations routes
routes.post("/specialization", verifyCoordinatorRole, addWorkshopSpecializationValidations(), validationErrorHandler, addWorkshopSpecialization);
routes.get("/specializations", verifyCoordinatorRole, getWorkshopSpecializations);

// approve workshop
routes.put("/approve", verifyAdministratorRole, workshopIdValidation(), validationErrorHandler, approveWorkshop);

//get workshop details
routes.get("/user-workshops", verifyCoordinatorRole, getUserWorkshops);
routes.get("/:workshop_id", getWorkshopDetails);

routes.get("/", getAllWorkshops);

//quiz Routes
routes.use('/quiz',quizRoutes);

module.exports = routes;
