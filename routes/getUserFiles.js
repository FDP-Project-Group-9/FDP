const express = require('express');
const { authenticateJWT } = require('../middlewares/passport');
const { checkIfUserIsApproved } = require('../middlewares/userAuthorization');
const { getRegistrationDoc } = require('../controllers/coordinatorDocs');

const routes = express.Router();

//route to get registration doc
routes.get("/registration-doc", authenticateJWT, checkIfUserIsApproved, getRegistrationDoc);

module.exports = routes;