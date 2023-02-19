const express = require('express');
const passport = require('passport');
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

routes.get('/user-details/:id',passport.authenticate('jwt', { session: false }),userDetails);

routes.put('/authorize-user/:id',passport.authenticate('jwt',{session:false}),authorize)

module.exports = routes;