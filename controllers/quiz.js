
const { throwError } = require("../utils/helper");

const quizDetails=require('../models/quizDetails')
const questions=require('../models/questions')



exports.createQuiz=(async (req,res,next)=>{
    const edit=req.query.edit;
    const quiz_name=req.body.quiz_name
    if(edit && edit.toLowerCase() == 'true'){
        const id=req.body.quiz_id
        try{
          const result=await quizDetails.updateQuizName(id,quiz_name);
            if(result.rowsAffected.length > 0){

          return res.status(200).json({msg: "Details of Resource Person Successfully updated"});
            }
            else{
                throwError("Something went Wrong",400);
            }
        }
        catch(err){
          return next(err)
        }
    }
    else{
    try{
    const quiz=new quizDetails(quiz_name);
    await quiz.addQuizDetails();
    return res.status(201).json({msg: "New Quiz Created"});
    }
    catch(err){
        next(err);
    }
}
})

exports.addQuestions=(async(req,res,next)=>{
    const edit=req.query.edit;
    let requestData=new Object();
    requestData={
    quiz_id:req.body.quiz_id,
    questStmt:req.body.question_statement,
    option1:req.body.option1,
    option2:req.body.option2,
    option3:req.body.option3,
    option4:req.body.option4,
    answer:req.body.answer
    }
    if(edit && edit.toLowerCase() == 'true'){
        const id=req.body.question_id
        try{
            const result=await questions.updateQuestion(id,requestData);
             const ans=await questions.findQuestionStatementById(id);
            if(result.rowsAffected.length > 0){
          return res.status(200).json({msg: "Details of Questions Successfully updated"});
            }
            else{
                throwError("Something went Wrong",400);
            }
        }
        catch(err){
          return next(err)
        }
    }
    else{
        try{
            console.log(requestData)
        const question=new questions(requestData);
        await question.addQuestionDetails();
        return res.status(201).json({msg: "Question Successfully Added"});
    }
    catch(err){
        next(err);
    }
    }
})