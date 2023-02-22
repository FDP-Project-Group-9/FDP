const ResourcePerson=require('../models/resourcePerson')

const {throwError}=require('../utils/helper')

exports.addResourcePerson=(async(req,res,next)=>{
    const edit=req.query.edit;
    let requestData=new Object();
    requestData={
    name:req.body.person_name,
    emailId:req.body.email_id,
    mobNo:req.body.mobile_no,
    designation:req.body.designation,
    specialization_id:req.body.specialization_id,
    country:req.body.country,
    state_name:req.body.state_name,
    organization_name:req.body.organization_name
    }
    if(edit && edit.toLowerCase() == 'true'){
        const id=req.body.id
        console.log(requestData)
      try{
        const result=await ResourcePerson.updateResourcePerson(id,requestData);
        return res.status(201).json({msg: "Details of Resource Person Successfully updated"});
      }
      catch(err){
        return next(err)
      }
    }
    else{
        const user = new ResourcePerson(requestData)
        console.log(user)
            try{
                await user.addResourcePersonDetails();
                return res.status(201).json({msg: "Resource Person Successfully Added"});
            }
            catch(err){
                return next(err);
            }
    }

   
})


exports.getAllResourcePerson=(async(req,res,next)=>{
    try{
       const result =await ResourcePerson.getAllResourcePersonDetails();
       const results=result.recordset 
       return res.status(200).json({results});
    }
    catch(err){
        return next(err);
    }
})


exports.getSingleResourcePerson=(async(req,res,next)=>{
    const id=req.params.id
    try{
        const result =await ResourcePerson.getResourcePersonbyId(id);
        const results=result.recordset 
        return res.status(200).json({results});
     }
     catch(err){
         return next(err);
     }
})

exports.deleteSingleResourcePerson=(async(req,res,next)=>{
    const id=req.params.id
    try{
        const result =await ResourcePerson.deleteResourcePersonbyId(id); 
        return res.status(200).json({msg:"Resource Person Successfully deleted"});
     }
     catch(err){
         return next(err);
     }
})

exports.getResourcePersonByFilters=(async(req,res,next)=>{
    
})