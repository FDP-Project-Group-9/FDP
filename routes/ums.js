const express = require('express');
const { authenticateJWT } = require('../middlewares/passport');
const { signup, uploadFiles,login,userDetails,authorize } = require('../controllers/ums');
const { 
    signupValidationRules, 
    uploadFilesValidationRules,
    loginValidationRules,
} = require('../middlewares/umsValidations');
const { validationErrorHandler } = require("../utils/helper");

//creating routes object
const routes = express.Router();

//creating routes for onboarding...
routes.post("/signup", signupValidationRules(), validationErrorHandler, signup);

routes.post("/upload-files", uploadFilesValidationRules(), validationErrorHandler, uploadFiles);

routes.post("/login",loginValidationRules(),validationErrorHandler,login);

routes.get('/user-details/:id', authenticateJWT, userDetails);

routes.put('/authorize-user/:id', authenticateJWT, authorize)

module.exports = routes;