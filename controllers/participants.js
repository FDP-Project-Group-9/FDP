
const WorkshopPartiipant=require('../models/workshopParticipants')
const Attendance= require('../models/arttendance');
const WorkshopDetails=require('../models/workshopDetails')
const Quiz=require('../models/quizDetails');
const { throwError } = require('../utils/helper');
const quizDetails = require('../models/quizDetails');

exports.workshopApply=(async(req,res,next)=>{
    let requestData=new Object();
    requestData={
        workshopId:req.body.workshopId,
        participantId:req.body.participantId,
        approvalStatus:2
    }
    
            let workshopParticipant=new WorkshopPartiipant(requestData);
            try{
                await workshopParticipant.addWorkshopParticipants();
                return res.status(201).json({msg: "Participant Applied for the workshop"});
            }
            catch(err){
                return next(err);
            }    
     

})


exports.getAllParticipants=(async(req,res,next)=>{
     const workshopId=req.body.workshopId
     // status can be Approved,Rejected, pending, Applied
     let  approvalStatus=req.body.approvalStatus;
     // no of enteries per api call
     let pageNo=Number(req.query.page_no??1);
     let perPage = Number(req.query.per_page ?? 10);
     try{
     const offset = (pageNo-1)*perPage;
     const results=await WorkshopPartiipant.getAllparticipants(offset,perPage,workshopId,approvalStatus);
     const  responseData=results[0].recordsets[0];
     const totalWorkshopsCount = results[1].recordset[0].total_rows;
      res.status(200).json({
         data: {
             workshops: responseData,
             total_workshops_count: totalWorkshopsCount
         }
     });
    }
    catch(err){
        return next(err)
    }
})


exports.getParticipantDetailById=(async(req,res,next)=>{
    const participantId=req.params.participantId
    try{
     const result=await WorkshopPartiipant.getParticipantDetailsById(participantId)
     if(result.recordset.length===0){
        throwError("No Profile found for this user",400)
     }
     console.log(result)
     res.status(200).json({
        data:result.recordset[0]
     })
    }
    catch(err){
        return next(err);
    }
})


exports.approveParticipant=(async(req,res,next)=>{
    let data={}
    data.workshopId=req.body.workshopId
    data.participantId=req.body.participantId
    data.approvalStatus=req.body.approvalStatus.toLowerCase()==='rejected'?-1:3
    try{
          if(data.approvalStatus===3){
            let attendance =new Attendance(data);
            try{
                await attendance.addAttendanceDetails(); 
                console.log("Attendance Details addded");
                try{
                    const result=await Attendance.getAttendanceDetails(data.workshopId,data.participantId);
                    data.attendanceId=result.recordset[0].id;
                   
                }
                catch(err){
                    return next(err)
                }
            }
            catch(err){
                return next(err);
            }
          }
          try{
            const result=await WorkshopPartiipant.updateStatus(data);
                if(result.rowsAffected[0] > 0){
                  return res.status(200).json({msg: "Participant Status got updated"});
                     }
                    else{
                        throwError("Participant or workshop not found",404);
                    }  
        }
        catch(err){
            return next(err)
        }
    }
    catch(err){
        return next(err)
    }
   
})

exports.getWorkshops=(async(req,res,next)=>{
     let data={}
     data.participantId=req.body.participantId;
    // status can be Approved,Rejected, pending, Applied
     data.participant_approval_status=req.body.participant_approval_status;
     // status can be completed, ongoing, upcoming
     data.timeline_status=req.body.timeline_status
      // no of enteries per api call
     data.pageNo=Number(req.query.page_no??1);
     data.perPage = Number(req.query.per_page ?? 10);
     let responseData;
     try{
     const offset = (data.pageNo-1)*data.perPage;
    
     const workshopDetails= await WorkshopPartiipant.getParticipantsWorkshop(offset,data.timeline_status,data);
     responseData=workshopDetails[0].recordsets[0];
     const totalWorkshopsCount = workshopDetails[1].recordset[0].total_rows;
     res.status(200).json({
        data: {
            workshops: responseData,
            total_workshops_count: totalWorkshopsCount
        }
    });
          }     catch(err){
    return next(err)
}
})


exports.getQuizParticipant=(async(req,res,next)=>{
   const workshopId=req.body.workshopId
   const participantId=req.body.participantId
      // no of enteries per api call
      let pageNo=Number(req.query.page_no??1);
      let perPage = Number(req.query.per_page ?? 10);
   try{
        const result=await WorkshopPartiipant.getParticipantWorkshopById(workshopId,participantId);
        if(result.recordset.length===0){
            throwError("Participant Doesn't applied for the workshop",400);
        }
        try{   
            const response=await WorkshopDetails.getDetails(workshopId);
            const quizId=response.recordset[0].quiz_id
        try{
            const offset = (pageNo-1)*perPage;

        const results=await quizDetails.getQuizDetailsForParticipant(offset,perPage,quizId);
        const  responseData=results[0].recordsets[0];
        const totalQuestionsCount = results[1].recordset[0].total_rows;
        return res.status(200).json({
            data: {
                quiz: responseData,
                total_questions_count: totalQuestionsCount
            }
        });
        }
        catch(err){
            return next(err);
        }
    }
    catch(err){
        return next(err)
    }
    }
   catch(err){
    return next(err);
   }
})

exports.evaluateScore=(async(req,res,next)=>{
    const workshopId=req.body.workshopId;
    const participantId=req.body.participantId;
    const participantAnswers=req.body.participant_answers
    try{   
        const response=await WorkshopDetails.getDetails(workshopId);
        const quizId=response.recordset[0].quiz_id
    try{
        const resu=await WorkshopPartiipant.getParticipantDetailsforWorkshop(workshopId,participantId)
        if(resu.recordset[0].quiz_attempted===true){
            throwError("Quiz Already attempted by the participant",400);
        }
    try{
    const results=await quizDetails.getAnswersForQuiz(quizId);
    const data=results.recordset
    let answerMap={}
    let Score=0;
    if(data.length!=participantAnswers.length){
        throwError("All Questions are not attempted",400)
    }
    data.map((item)=>{
        answerMap[item.question_id]=item.answer
    })
    participantAnswers.map((item)=>{
        if(answerMap[item.questionId]===item.answer)  Score++;
    })
   
    try{
        let quizAttempt=1;
        const responseData= await WorkshopPartiipant.updateQuizDetails(quizAttempt,Score,workshopId,participantId);
        if(responseData.rowsAffected[0]>0){
         return res.status(200).json({msg:"Quiz Attempted"})
        }
        else {
            throwError("Participant already attempted the quiz",400)
        }
    }
    catch(err){
        console.log(err)
        return next(err)
    }
}
catch(err){
    return next(err);
}
    }
    catch(err){
        return next(err);
    }
}
catch(err){
    return next(err)
}
})

exports.updateAttendance=(async(req,res,net)=>{
    let requestData={}
    requestData.workshopId=req.body.workshopId;
    requestData.participantId=req.body.participantId;
    requestData.day1=req.body.day1
    requestData.day2=req.body.day2
    requestData.day3=req.body.day3
    requestData.day4=req.body.day4
    requestData.day5=req.body.day4
   try{
       const result=await Attendance.updateAttendance(requestData)
       req.status(200).json({msg:"Attendance gets updated"})
   }
   catch(err){
    return next(err)
   }

})

exports.getAttendance=(async(req,res,next)=>{
    
})