const express = require('express');
const {
    workshopApply,
    getWorkshops
}=require('../controllers/participants')
const { validationErrorHandler } = require('../utils/helper');

const routes = express.Router();

routes.post("/workshop/participant/apply",validationErrorHandler, workshopApply);

routes.get('/workshop/participants/getWorkshops',validationErrorHandler,getWorkshops)

module.exports = routes;