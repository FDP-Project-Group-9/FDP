const express = require('express');
const { authenticateJWT } = require('../middlewares/passport');
const { checkIfUserIsApproved } = require('../middlewares/userAuthorization');
const { getRegistrationDoc, getCoordinatorPhoto, getCoordinatorMandateForm, getCoordinatorSignature, getInstituteLogo } = require('../controllers/coordinatorDocs');

const routes = express.Router();

//route to get registration doc
routes.get("/registration-doc", authenticateJWT, checkIfUserIsApproved, getRegistrationDoc);

routes.get("/coordinator-photo", authenticateJWT, checkIfUserIsApproved, getCoordinatorPhoto);

routes.get("/mandate-form", authenticateJWT, checkIfUserIsApproved, getCoordinatorMandateForm);

routes.get("/coordinator-signature", authenticateJWT, checkIfUserIsApproved, getCoordinatorSignature);

routes.get("/institute-logo", authenticateJWT, checkIfUserIsApproved, getInstituteLogo);

module.exports = routes;