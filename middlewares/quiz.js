const { body } = require("express-validator");

const resourcePerson = require("../models/resourcePerson");
const QuizDetails=require("../models/quizDetails")
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
    .withMessage("Quiz Name must have atleaat 1 character and atmost 50 characters"),

    body("workshopId")
    .exists()
    .withMessage("Workshop Id is required!")
    .bail()
    .custom(async workshopId => {
        try{
            const result = await QuizDetails.getquizDetails(workshopId);
            if(result.recordset.length > 0)
                return Promise.reject(
                    {
                        errorMsg: "Quiz already exists for this workshop!",
                        status: 409
                    }
                );           
        }
        catch(err){
            return Promise.reject(
                { 
                    errorMsg: err.msg, 
                    status: err.status
                }
            );
        }
    })
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
