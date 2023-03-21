require('dotenv').config();
const accountSID = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = require('twilio')(accountSID, authToken);
const Twilio = require("../models/twilio");
const { throwError } = require('../utils/helper');

exports.createTwilioSMSService = async () => {
    try{
        const response = await client.verify.v2.services
                                .create({
                                    friendlyName: 'FDP OTP Service'
                                });
        const twilio = new Twilio(response.sid);
        await twilio.addSID();
        console.log('Created Twilio connection');
    }
    catch(err){
        console.error("Something went wrong while creating twilio service!");
    }
};

exports.sendOTP = async (mobileNo) => {
    try{
        const result = await Twilio.getSID();
        if(result.recordset.length == 0){
            throwError("No connection found for sms otp service!", 500);
        }
        const sid = result.recordset[0]['sid'];
        return await client.verify.v2.services(sid).verifications
            .create({
                to: `+91${mobileNo}`,
                channel: 'sms',
            });
    }
    catch(err){
        throw err;
    }
};

exports.verifyOTP = async (mobileNo, otp) => {
    try{
        const result = await Twilio.getSID();
        if(result.recordset.length == 0){
            throwError("No connection found for sms otp service!", 500);
        }
        const sid = result.recordset[0]['sid'];
        return await client.verify.v2.services(sid).verificationChecks
            .create({
                to: `+91${mobileNo}`,
                code: `${otp}`
            });
    }
    catch(err){
        console.log(err);
        throwError("something went wrong!", 500);
    }  
};