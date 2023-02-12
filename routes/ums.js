const express = require('express');
const { body } = require('express-validator');
const { signup } = require('../controllers/ums');
const { signupValidationRules, signupValidation } = require('../middlewares/ums');

//creating routes object
const routes = express.Router();

//creating routes for onboarding...
routes.post("/signup", signupValidationRules(), signupValidation, signup);

module.exports = routes;