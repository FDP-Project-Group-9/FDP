const express = require('express');
const { authenticateJWT } = require('../middlewares/passport');
const { signup, uploadFiles,login,userDetails,authorize, getRoles, updateProfile } = require('../controllers/ums');
const { 
    signupValidationRules, 
    uploadFilesValidationRules,
    loginValidationRules,
    updateUserDetailsRules,
} = require('../middlewares/umsValidations');
const { verifyAdministratorRole, checkIfUserIsApproved } = require("../middlewares/userAuthorization");
const { validationErrorHandler } = require("../utils/helper");
const { uploadUserDocs } = require("../config/fileUploads");

//creating routes object
const routes = express.Router();

//creating routes for onboarding...
routes.post("/signup", signupValidationRules(), validationErrorHandler, signup);

routes.post("/upload-files", uploadUserDocs, uploadFilesValidationRules(), validationErrorHandler, uploadFiles);

routes.post("/login", loginValidationRules(), validationErrorHandler,login);

routes.get('/user-details/:id', authenticateJWT, checkIfUserIsApproved, userDetails);

routes.put('/authorize-user/:id', authenticateJWT, verifyAdministratorRole, authorize)

routes.put('/update-profile/:userId', authenticateJWT, checkIfUserIsApproved, updateUserDetailsRules(), validationErrorHandler, updateProfile);

routes.get('/roles', getRoles);

module.exports = routes;