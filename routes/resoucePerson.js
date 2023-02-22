const express = require('express');
const {
  addResourcePerson,
  getAllResourcePerson,
  getSingleResourcePerson,
  deleteSingleResourcePerson,
  getResourcePersonByFilters
} = require('../controllers/resourcePerson');

const { validationErrorHandler } = require("../utils/helper");
const {
    resourcePersondetailsValidation,
} = require("../middlewares/resurcePersonValidation");

const { verifyCoordinatorRole } = require('../middlewares/userAuthorization');
const routes = express.Router();



routes.put('/add',verifyCoordinatorRole,resourcePersondetailsValidation(),validationErrorHandler,addResourcePerson);

routes.get('/fetch-all',verifyCoordinatorRole,getAllResourcePerson);

routes.get('/fetch/:id',verifyCoordinatorRole,getSingleResourcePerson);

routes.delete('/delete/:id',verifyCoordinatorRole,deleteSingleResourcePerson);

routes.get('/filter:filter',verifyCoordinatorRole,getResourcePersonByFilters)

module.exports = routes;