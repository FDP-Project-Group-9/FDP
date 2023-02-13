const express = require('express');
const { signup, uploadFiles } = require('../controllers/ums');
const { 
    signupValidationRules, 
    signupValidation,
    uploadFilesValidationRules,
    uploadFilesValidation 
} = require('../middlewares/ums');

//creating routes object
const routes = express.Router();

//creating routes for onboarding...
routes.post("/signup", signupValidationRules(), signupValidation, signup);

routes.post("/upload-files", uploadFilesValidationRules(), uploadFilesValidation, uploadFiles);

module.exports = routes;