const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');


// Load User model
const User = require('../../models/User');


// @route   POST api/user/register
// @desc    Register user
// @access  Public
router.post('/register',(req,res)=>{

User.findOne({email:req.body.email}).then(user=>{
    if (user) {
        errors.email = 'Email already exists';
        return res.status(400).json(errors);
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
                .then(res=> res.json(user))
                .catch(err=> console.log(err))
            })
          })
      }
})


})




// @route   GET api/users/login
// @desc    Login User / Returning JWT Token
// @access  Public
