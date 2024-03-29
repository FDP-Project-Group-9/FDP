const express = require('express');

const createWorkshopRoutes = require('./createWorkshop');
const uploadWorkshopFilesRoutes = require('./workshopUploads');
const deleteWorkshopFilesRoutes = require('./workshopDeleteFile');
const getWorkshopFilesRoutes = require('./getWorkshopFiles');
const quizRoutes=require('./quiz');
const workshopParticipantsRoutes=require('./workshopParticipants');
const workshopFinanceRoutes = require("./workshopFinances");

const { addWorkshopSpecialization, getWorkshopSpecializations } = require('../controllers/workshopSpecialization');
const { verifyCoordinatorRole, verifyAdministratorRole } = require('../middlewares/userAuthorization');
const { addWorkshopSpecializationValidations } = require("../middlewares/workshopSpecializationValidations");
const { getWorkshopDetails, getAllWorkshops, getUserWorkshops } = require("../controllers/showWorkshop")
const { validationErrorHandler } = require('../utils/helper');
const { approveRejectWorkshop } = require('../controllers/createWorkshop');
const { workshopApprovalRejectionValidation } = require('../middlewares/workshopCreationValidations');
const { checkIfWorkshopExists } = require('../middlewares/workshop');

const routes = express.Router();

// routes for creating workshop
routes.use("/create-workshop", verifyCoordinatorRole, createWorkshopRoutes);

//routes for uploading workshop files
routes.use("/upload", verifyCoordinatorRole, uploadWorkshopFilesRoutes);

//routes for deleting workshop files
routes.use("/delete", verifyCoordinatorRole, checkIfWorkshopExists, deleteWorkshopFilesRoutes);

//routes for viewing workshop files
routes.use("/view", getWorkshopFilesRoutes);

// workshop specializations routes
routes.post("/specialization", verifyCoordinatorRole, addWorkshopSpecializationValidations(), validationErrorHandler, addWorkshopSpecialization);
routes.get("/specializations", getWorkshopSpecializations);

// approve workshop
routes.put("/approve-application", verifyAdministratorRole, workshopApprovalRejectionValidation(), validationErrorHandler, approveRejectWorkshop);

//get workshop details
routes.get("/user-workshops", verifyCoordinatorRole, getUserWorkshops);
routes.get("/:workshop_id", getWorkshopDetails);

//get Participants
routes.use('/workshop-participants',verifyCoordinatorRole, workshopParticipantsRoutes)

//quiz Routes
routes.use('/quiz',quizRoutes);

routes.use("/finance", workshopFinanceRoutes);

routes.get("/", getAllWorkshops);

module.exports = routes;
