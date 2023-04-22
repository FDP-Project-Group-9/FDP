const { body } = require("express-validator");

const WorkshopPartiipant=require('../models/workshopParticipants');


exports.workshopParticipantValidaion=()=>{
    return [

    body("workshopId")
    .exists()
    .withMessage("Workshop Id is required!")
    .bail(),

    body("participantId")
    .exists()
    .withMessage("Participant Id is required!")
    .bail()
    .custom((async (value, {req}) => {
        const workshopId=req.body.workshopId
        const participantId=req.body.participantId
        try{
        const result=await WorkshopPartiipant.getParticipantWorkshopById(workshopId,participantId);
        if(result.recordset.length > 0)
        return Promise.reject(
            {
                errorMsg: "Participant already applied for this workshop!",
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
    })),
]
}

