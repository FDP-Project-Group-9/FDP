
const { throwError } = require("../utils/helper");

const quizDetails=require('../models/quizDetails')
const questions=require('../models/questions')



exports.createQuiz=(async (req,res,next)=>{
    const edit=req.query.edit;
    const quiz_name=req.body.quiz_name
    const workshopId=req.body.workshopId
     let requestData={};
        requestData.quiz_name=quiz_name
        requestData.workshopId=workshopId
    if(edit && edit.toLowerCase() == 'true'){
        try{
          const result=await quizDetails.updateQuizName(workshopId,quiz_name);
            if(result.rowsAffected.length > 0){

          return res.status(200).json({msg: "Quiz Name Successfully updated"});
            }
            else{
                throwError("Quiz Not Found",404);
            }
        }
        catch(err){
          return next(err)
        }
    }
    else{
    try{
       
    const quiz=new quizDetails(requestData);
     await quiz.addQuizDetails();
     try{
     const result= await quizDetails.getquizDetails(workshopId)
     let quizId=result.recordsets[0][0].id
    let data={}
    data.workshopId=workshopId
    data.quiz_id=quizId
    data.quizGenerated=1
    try{
     const resu=await quizDetails.updateworkshopDetails(data)
    return res.status(201).json({msg: "New Quiz Created"});
    }
    catch(err){
        return next(err)
     }
     }
     catch(err){
        return next(err)
     }
    }
    catch(err){
        next(err);
    }
}
})

exports.getQuizDetails=(async(req,res,next)=>{
    const workshopId=req.body.workshopId;
    try{
       const responseData=await quizDetails.getquizDetails(workshopId);
       console.log(responseData)
       if(responseData.recordset[0].length===0) {
        throwError("Quiz not created for this Workshop",404)
    }
       return res.status(200).json({data:responseData.recordsets[0]});
    }
    catch(err){
        return next(err)
    }
})

exports.addQuestions=(async(req,res,next)=>{
    const edit=req.query.edit;
    let requestData=new Object();
    requestData={
    questStmt:req.body.question_statement,
    option1:req.body.option1,
    option2:req.body.option2,
    option3:req.body.option3,
    option4:req.body.option4,
    answer:req.body.answer,
    workshopId:req.body.workshopId
    }
    if(edit && edit.toLowerCase() == 'true'){
        const id=req.body.question_id
        try{
            const result=await questions.updateQuestion(id,requestData);
            if(result.rowsAffected.length > 0){
          return res.status(200).json({msg: "Details of Questions Successfully updated"});
            }
            else{
                throwError("Quiz Not Found",404);
            }
        }
        catch(err){
          return next(err)
        }
    }
    else{
        try{
        const result=await quizDetails.getquizDetails(requestData.workshopId);
        if(result.recordsets[0].length===0) {
            throwError("Quiz not created for this Workshop",404)
        }
        requestData.quiz_id=result.recordsets[0][0].id;
     try{
        const question=new questions(requestData);
        await question.addQuestionDetails();
        try{
          const result=await quizDetails.updateTotalQuestions(requestData.workshopId, requestData.quiz_id)
          return res.status(201).json({msg: "Question Successfully Added"});
        }
        catch(err){
            return next(err)
        }
        
    }
    catch(err){
        next(err);
    }
 
}
    catch(err){
        next(err);
    }
    }
})

exports.deleteQuiz=(async(req,res,next)=>{
    const workshopId=req.body.workshopId

    try{
      
        const result=await quizDetails.getquizDetails(workshopId);
        if(result.recordsets[0].length===0) {
            throwError("Quiz not created for this Workshop",404)
        }
        let quiz_id=result.recordsets[0][0].id;
      
        try{
            let data={}
            data.workshopId=workshopId
            data.quiz_id=null
            data.quizGenerated=0
            const resu=await quizDetails.updateworkshopDetails(data)
            console.log("Workshop Details updated")
            try{
                const results=await questions.deleteAllQuestions(quiz_id);
                console.log("All questions Deleted")
                try{
                    const result1=await quizDetails.deleteQuiz(workshopId);
                    if(result1.rowsAffected.length > 0){
                         return res.status(200).json({msg: "Quiz Successfully deleted"});
                           }
                           else{
                               throwError("Something went Wrong",500);
                           }
                }
                catch(err){
                    return next(err)
                }

            }
            catch(err){
                return next(err)
            }
        }
        catch(err){
            return next(err)
        }
    }
    catch(err){
        next(err);
    }
})

exports.deleteQuestion=(async(req,res,next)=>{
    const id=req.body.question_id;
    const workshopId=req.body.workshopId;
    const quizId=req.body.quizId
    try{
        const result=await questions.deleteQuestionByID(id);
       if(result.rowsAffected.length > 0){    
            try{
              const result=await quizDetails.updateTotalQuestions(workshopId,quizId)
              return res.status(200).json({msg: "Question deleted Successfully...."});
            }
            catch(err){
                return next(err)
            }
       }
       else{
           throwError("Quiz Not Found !!",404);
       }
    }
    catch(err){
        next(err);
    }
})

exports.getQustions=(async(req,res,next)=>{
    const id = req.body.workshopId
    let pageNo=Number(req.query.page_no??1);
    let perPage = Number(req.query.per_page ?? 10);

    try{
        const result=await quizDetails.getquizDetails(id);
        if(result.recordsets[0].length===0) {
            throwError("Quiz not created for this Workshop",404)
        }
        quiz_id=result.recordsets[0][0].id;
    try{
        const offset = (pageNo-1)*perPage;
           const result1=await questions.getQuestionByFilters(offset,perPage,quiz_id);
           const  responseData=result1[0].recordsets[0];
           const totalQuestionsCount = result1[1].recordset[0].total_rows;
           return res.status(200).json({
           msg: "Quiz details successfully fetched!",
           data: {
            quiz: responseData,
            total_questions_count: totalQuestionsCount
        }
       });
    }
    catch(err){
        next(err);
    }
}
catch(err){
    return next(err);
}
})


