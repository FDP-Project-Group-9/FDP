const express = require('express');
const {
    createQuiz,
    addQuestions
} = require('../controllers/quiz');

const { validationErrorHandler } = require("../utils/helper");
const {
    questionValidationRules,
    quizValidationRules
} = require("../middlewares/quiz");

const routes = express.Router();

routes.put('/create_Quiz',quizValidationRules(),validationErrorHandler,createQuiz);

routes.put('/addQuestion',questionValidationRules(),validationErrorHandler,addQuestions);



module.exports = routes;