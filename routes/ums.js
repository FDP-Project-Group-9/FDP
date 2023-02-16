const express = require('express');
const { signup, uploadFiles,login } = require('../controllers/ums');
const { 
    signupValidationRules, 
    AuthenticationValidation,
    uploadFilesValidationRules,
    uploadFilesValidation,
    loginValidationRules,
} = require('../middlewares/ums');

//creating routes object
const routes = express.Router();

//creating routes for onboarding...
routes.post("/signup", signupValidationRules(), AuthenticationValidation, signup);

routes.post("/upload-files", uploadFilesValidationRules(), uploadFilesValidation, uploadFiles);

routes.post("/login",loginValidationRules(),AuthenticationValidation,login);

module.exports = routes;