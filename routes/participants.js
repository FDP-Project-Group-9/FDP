const express = require('express');
const {
    workshopApply,
    getWorkshops,
    evaluateScore,
    getParticipantDetailById,
    getQuizParticipant,
    getParticipantDetailWorkshop,
    getAttendance
}=require('../controllers/participants')
const {workshopParticipantValidaion} =require('../middlewares/participantApplicationValidation')
const { validationErrorHandler } = require('../utils/helper');

const routes = express.Router();

routes.post("/workshop/participant/apply",workshopParticipantValidaion(),validationErrorHandler, workshopApply);

routes.get('/workshop/participants/getWorkshops',validationErrorHandler,getWorkshops);

routes.get('/workshop/participant/getParticipantQuiz',validationErrorHandler,getQuizParticipant);

routes.get('/workshop/participant/getAttendance',validationErrorHandler,getAttendance);

routes.put('/workshop/participant/evaluateScore',validationErrorHandler,evaluateScore)

routes.get('/workshop/:participantId',validationErrorHandler,getParticipantDetailById)

routes.get('/workshop/participant/getParticipantDetailWorkshop/:workshopId/:participantId',validationErrorHandler,getParticipantDetailWorkshop)


module.exports = routes;