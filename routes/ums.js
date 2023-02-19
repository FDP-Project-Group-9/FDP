const express = require('express');
const { authenticateJWT } = require('../middlewares/passport');
const { signup, uploadFiles,login,userDetails,authorize } = require('../controllers/ums');
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

routes.get('/user-details/:id', authenticateJWT, userDetails);

routes.put('/authorize-user/:id', authenticateJWT, authorize)

module.exports = routes;