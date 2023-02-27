const express = require('express');
const {
  addResourcePerson,
  getSingleResourcePerson,
  deleteSingleResourcePerson,
  getResourcePersonDetails
} = require('../controllers/resourcePerson');

const { validationErrorHandler } = require("../utils/helper");
const {
    resourcePersondetailsValidation,
} = require("../middlewares/resurcePersonValidation");

const routes = express.Router();



routes.put('/add',resourcePersondetailsValidation(),validationErrorHandler,addResourcePerson);

routes.get('/fetch/:id',getSingleResourcePerson);

routes.delete('/delete/:id',deleteSingleResourcePerson);

routes.get('/fetch-details',getResourcePersonDetails)

module.exports = routes;