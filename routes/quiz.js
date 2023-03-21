const express = require('express');
const {
    createQuiz,
    addQuestions,
    deleteQuiz,
    deleteQuestion,
    getQustions,
    evaluateParticipants
} = require('../controllers/quiz');

const { validationErrorHandler } = require("../utils/helper");
const {
    questionValidationRules,
    quizValidationRules
} = require("../middlewares/quiz");

const { verifyCoordinatorRole } = require('../middlewares/userAuthorization');

const routes = express.Router();

routes.put('/create_Quiz',verifyCoordinatorRole,quizValidationRules(),validationErrorHandler,createQuiz);

routes.put('/addQuestion',verifyCoordinatorRole,questionValidationRules(),validationErrorHandler,addQuestions);

routes.delete('/delete-quiz',verifyCoordinatorRole,validationErrorHandler,deleteQuiz);

routes.delete('/delete-question',verifyCoordinatorRole,validationErrorHandler,deleteQuestion);

routes.get('/getQuestions',validationErrorHandler,getQustions);

routes.put('/evaluateParticipant',validationErrorHandler,evaluateParticipants);


module.exports = routes;