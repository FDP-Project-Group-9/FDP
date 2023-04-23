const express = require('express');
const {
    getAllParticipants,
    approveParticipant,
    updateAttendance
}=require('../controllers/participants')
const { validationErrorHandler } = require('../utils/helper');


const routes = express.Router();



routes.get("/workshop/getParticipants",validationErrorHandler, getAllParticipants);

//Accept/Reject Participants
routes.put("/workshop/approve-participant",validationErrorHandler,approveParticipant)

// Update Attendance of participant 
routes.put('/workshop/update-attendance',validationErrorHandler,updateAttendance)

module.exports = routes;