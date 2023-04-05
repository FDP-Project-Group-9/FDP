const express = require('express');
const { uploadRegistrationDoc, updateMandateDocs, deleteMandateDocs, getRegistrationDoc } = require('../controllers/coordinatorDocs');
const { uploadRegistrationDocValidationRules, addMandateDocsValidationRules } = require('../middlewares/umsValidations');
const { validationErrorHandler } = require('../utils/helper');
const { authenticateJWT } = require('../middlewares/passport');
const { checkIfUserIsApproved, verifyCoordinatorRole, verifyAdministratorRole } = require('../middlewares/userAuthorization');

const routes = express.Router();

//route for uploading registration doc
routes.post("/registration-doc", uploadRegistrationDocValidationRules(), validationErrorHandler, uploadRegistrationDoc);

//route for updating/adding coordinator mandate form
routes.put("/mandate-docs", authenticateJWT, checkIfUserIsApproved, verifyCoordinatorRole, addMandateDocsValidationRules(), validationErrorHandler, updateMandateDocs);

//route for deleting mandate docs;
routes.delete("/mandate-docs", authenticateJWT, checkIfUserIsApproved, verifyCoordinatorRole, deleteMandateDocs);

module.exports = routes;