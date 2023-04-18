
const WorkshopPartiipant=require('../models/workshopParticipants')

exports.workshopApply=(async(req,res,next)=>{
    console.log(req.body)
    let requestData=new Object();
    requestData={
        workshopId:req.body.workshopId,
        participantId:req.body.participantId,
        approvalStatus:req.body.approvalStatus
    }
    let workshopParticipant=new WorkshopPartiipant(requestData);
    try{
        await workshopParticipant.addWorkshopParticipants();
        console.log(1)
        return res.status(201).json({msg: "Participant Applied for the workshop"});
    }
    catch(err){
        return next(err);
    }    

})


exports.getParticipants=(async(req,res,next)=>{
    const workshopId=req.body.workshopId
    try{

    }
    catch(err){
        return next(err)
    }
})


exports.approveParticipant=(async(req,res,next)=>{
    let data={}
    data.workshopId=req.body.workshopId
    data.approvalStatus=req.body.approvalStatus
    data.participantId=req.body.participantId
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
})

exports.getWorkshops=(async(req,res,next)=>{
     let data={}
     data.participantId=req.body.participantId;
     data.status=req.body.status;
     try{
     if(data.status===1){

     }
    else{
    
    }
}
catch(err){
    return next(err)
}
})