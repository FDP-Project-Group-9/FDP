
const WorkshopPartiipant=require('../models/workshopParticipants')

exports.workshopApply=(async(req,res,next)=>{
    console.log(req.body)
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
    data.participantId=req.body.participantId
    data.approvalStatus=req.body.approvalStatus.toLowerCase()==='rejected'?-1:3
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