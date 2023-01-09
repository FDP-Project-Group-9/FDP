const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require('passport');


// Load User model
const User = require('../../models/User');


// @route   POST api/user/register
// @desc    Register user
// @access  Public
router.post('/register',(req,res)=>{
  console.log(req.body)
User.findOne({email:req.body.email}).then(user=>{
  console.log(req.body.email)
    if (user) { 
      console.log(user)
        // errors.email = 'Email already exists';
        return res.status(400).json('Email already exists');
      }
      else{
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            title: req.body.title,
            dob: req.body.dob,
            gender: req.body.gender,
            mobno: req.body.mobno,
            role:req.body.role
          });
          bcrypt.genSalt(10,(err,salt)=>{
            bcrypt.hash(newUser.password,salt,(err,hash)=>{
                if(err)  throw err
                newUser.password=hash
                newUser
                .save()
                .then(user=> res.json({user}))
                .catch(err=> console.log(err))
            })
          })
      }
})


})




// @route   GET api/users/login
// @desc    Login User / Returning JWT Token
// @access  Public
router.post('/login',(req,res)=>{

  const email = req.body.email;
  const password = req.body.password;
  User.findOne({email}).then((user)=>{
    if(!user){
      return res.status(404).send("User not found");
    }

    //Check Password
    bcrypt.compare(password,user.password).then(isMatch=>{
      if(isMatch){
        //User Matched
        const payload={id:user.id,name:user.name}//Create JWT Payload

        //Sign Token
        jwt.sign(payload,process.env.secret,(err,token)=>{
          res.json({
            success:true,
            token:'Bearer'+ token
          })
        })
      }
      else {
        return res.status(404).send("Password is Incorrect")
      }
    })
  })

})


module.exports = router;