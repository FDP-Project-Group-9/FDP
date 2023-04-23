const express = require('express');
const {
    workshopApply,
    getWorkshops,
    evaluateScore,
    getParticipantDetailById,
    getQuizParticipant
}=require('../controllers/participants')
const {workshopParticipantValidaion} =require('../middlewares/participantApplicationValidation')
const { validationErrorHandler } = require('../utils/helper');

const routes = express.Router();

routes.post("/workshop/participant/apply",workshopParticipantValidaion(),validationErrorHandler, workshopApply);

routes.get('/workshop/participants/getWorkshops',validationErrorHandler,getWorkshops);

routes.get('/workshop/participant/getParticipantQuiz',validationErrorHandler,getQuizParticipant);

routes.get('/workshop/evaluateScore',validationErrorHandler,evaluateScore)

routes.get('/workshop/:participantId',validationErrorHandler,getParticipantDetailById)

module.exports = routes;