const { body } = require("express-validator");

const resourcePerson = require("../models/resourcePerson");
const quizDetails=require("../models/quizDetails")
const Questions=require("../models/questions")


exports.quizValidationRules=()=>{
    return [
    body("quiz_name")
    .if((value, {req}) => {
        if(req.query.edit && req.query.edit.toLowerCase() == 'true'){
            return false
        }
        else
           return true;
    })
    .exists()
    .withMessage("Quiz Name is required!")
    .bail()
    .isLength({min: 1, max: 50})
    .withMessage("Quiz Name must have atleaat 1 character and atmost 50 characters")
]
}

exports.questionValidationRules = () => {
    return [
        body("quiz_id")
        .if((value, {req}) => {
            if(req.query.edit && req.query.edit.toLowerCase() == 'true'){
                return false
            }
            else
               return true;
        })
        .bail()
        .exists()
        .withMessage("Quiz Id is required!")
        ,
            body("question_statement")
            .if((value, {req}) => {
                if(req.query.edit && req.query.edit.toLowerCase() == 'true'){
                    return false
                }
                else
                   return true;
            })
            .bail()
            .exists()
            .withMessage("Qestion Statement is required!")
        ,
        body("option1")
        .if((value, {req}) => {
            if(req.query.edit && req.query.edit.toLowerCase() == 'true'){
                return false
            }
            else
               return true;
        })
        .bail()
        .exists()
        .withMessage("All Options are required!")
    ,
        body("option2")
        .if((value, {req}) => {
            if(req.query.edit && req.query.edit.toLowerCase() == 'true'){
                return false
            }
            else
            return true;
        })
        .bail()
        .exists()
        .withMessage("All Options are required!")
        ,
        body("option3")
        .if((value, {req}) => {
            if(req.query.edit && req.query.edit.toLowerCase() == 'true'){
                return false
            }
            else
            return true;
        })
        .bail()
        .exists()
        .withMessage("All Options are required!")
        ,
        body("option4")
        .if((value, {req}) => {
            if(req.query.edit && req.query.edit.toLowerCase() == 'true'){
                return false
            }
            else
            return true;
        })
        .bail()
        .exists()
        .withMessage("All Options are required!")
        ,
        body("answer")
        .if((value, {req}) => {
            if(req.query.edit && req.query.edit.toLowerCase() == 'true'){
                return false
            }
            else
            return true;
        })
        .bail()
        .exists()
        .withMessage("Answer is required!")
    ];
};
