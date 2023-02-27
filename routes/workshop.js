const express = require('express');
const { addWorkshopSpecialization, getWorkshopSpecializations } = require('../controllers/workshopSpecialization');
const { verifyCoordinatorRole } = require('../middlewares/userAuthorization');
const { addWorkshopSpecializationValidations } = require("../middlewares/workshopSpecializationValidations");
const { getWorkshopDetails, getAllWorkshops, getUserWorkshops } = require("../controllers/showWorkshop")
const { validationErrorHandler } = require('../utils/helper');
const createWorkshopRoutes = require('./createWorkshop');
const quizRoutes=require('./quiz');

const routes = express.Router();

// routes for creating workshop
routes.use("/create-workshop", verifyCoordinatorRole, createWorkshopRoutes);

// workshop specializations routes
routes.post("/specialization", verifyCoordinatorRole, addWorkshopSpecializationValidations(), validationErrorHandler, addWorkshopSpecialization);
routes.get("/specializations", verifyCoordinatorRole, getWorkshopSpecializations);

//get workshop details
routes.get("/user-workshops", verifyCoordinatorRole, getUserWorkshops);
routes.get("/:workshop_id", getWorkshopDetails);

routes.get("/", getAllWorkshops);

//quiz Routes
app.use('/quiz',authenticateJWT,quizRoutes);

module.exports = routes;
