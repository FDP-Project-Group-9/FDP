const bycrypt = require('bcrypt');

const User = require('../models/user');

exports.signup = ( async (req, res, next) => {
    const firstName = req.body["first_name"];
    const lastName = req.body["last_name"];
    const roleId = req.body["role_id"];
    const title = req.body.title;
    const dob = req.body.dob;
    const emailId = req.body["email_id"];
    const mobileNumber = req.body["mobile_no"];
    const gender = req.body.gender;
    let password = req.body.password;
    try {
        password = await bycrypt.hash(password, 12);
    }
    catch(err){
        err.status = 500;
        err.msg = 'Something went wrong while encrypting the password!';
        return next(err);
    };

    const user = new User(roleId, firstName, lastName, title, dob, gender, emailId, mobileNumber, password);

    try{
        const result = await user.save();
        return res.status(201).json({msg: "User successfully signed up"});
    }
    catch(err){
        return next(err);
    }
});