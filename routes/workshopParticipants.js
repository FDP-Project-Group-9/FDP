const express = require('express');
const {
    getParticipants,
    approveParticipant
}=require('../controllers/participants')
const { validationErrorHandler } = require('../utils/helper');

const routes = express.Router();

routes.get("/workshop/getParticipants",validationErrorHandler, getParticipants);

//Accept/Reject Participants
routes.put("/workshop/approve-participant",validationErrorHandler,approveParticipant)

module.exports = routes;