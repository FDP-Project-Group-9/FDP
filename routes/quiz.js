const express = require('express');
const {
    createQuiz,
    addQuestions,
    deleteQuiz,
    deleteQuestion,
    getQustions
} = require('../controllers/quiz');

const { validationErrorHandler } = require("../utils/helper");
const {
    questionValidationRules,
    quizValidationRules
} = require("../middlewares/quiz");

const routes = express.Router();

routes.put('/create_Quiz',quizValidationRules(),validationErrorHandler,createQuiz);

routes.put('/addQuestion',questionValidationRules(),validationErrorHandler,addQuestions);

routes.delete('/delete-quiz',validationErrorHandler,deleteQuiz);

routes.delete('/delete-question',validationErrorHandler,deleteQuestion);

routes.get('/getQuestions',validationErrorHandler,getQustions);



module.exports = routes;