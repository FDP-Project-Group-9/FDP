const express = require('express');
const { authenticateJWT } = require('../middlewares/passport');
const { signup,login,userDetails, approveRejectCoordinatorRegistration, getRoles, updateProfile, getAllCoordinators } = require('../controllers/ums');
const { 
    signupValidationRules, 
    loginValidationRules,
    updateUserDetailsRules,
    approveRejectCoordinatorRegistrationValidationRules,
} = require('../middlewares/umsValidations');
const { verifyAdministratorRole, checkIfUserIsApproved } = require("../middlewares/userAuthorization");
const { validationErrorHandler } = require("../utils/helper");
const { uploadUserDocs } = require("../config/fileUploads");
const userUploadFiles = require("../routes/userUploadFiles");
const viewUserFiles = require("./getUserFiles");

//creating routes object
const routes = express.Router();

//creating routes for onboarding...
routes.post("/signup", signupValidationRules(), validationErrorHandler, signup);

routes.use("/upload", uploadUserDocs, userUploadFiles);

routes.use("/view", viewUserFiles);

routes.post("/login", loginValidationRules(), validationErrorHandler,login);

routes.get('/user-details/:id', authenticateJWT, checkIfUserIsApproved, userDetails);

routes.put('/approve-registration', authenticateJWT, verifyAdministratorRole, approveRejectCoordinatorRegistrationValidationRules(), validationErrorHandler, approveRejectCoordinatorRegistration);

routes.put('/update-profile/:userId', authenticateJWT, checkIfUserIsApproved, updateUserDetailsRules(), validationErrorHandler, updateProfile);

routes.get('/roles', getRoles);

routes.get('/coordinators', authenticateJWT, verifyAdministratorRole, getAllCoordinators);

module.exports = routes;