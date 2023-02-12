const { getDB } = require('../config/db');
const { types } = require('../utils/dbTypes');
const { throwError } = require('../utils/utilFunctions');
const { tableNames } = require('../utils/constants');
module.exports = class User {

  constructor(roleId, firstName, lastName, title, dob, gender, emailId, mobileNumber, password){
    this.roleId = roleId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.title = title;
    this.dob = dob;
    this.gender = gender;
    this.emailId = emailId;
    this.mobileNumber = mobileNumber;
    this.password = password;
  }

  async save () {
    const db = getDB();
    const queryStmt = `INSERT INTO ${tableNames.USERS} values(
      @first_name, 
      @last_name, 
      @email_id,
      @mobile_no,
      @dob,
      @title,
      @password,
      @role_id,
      @profile_approved,
      @gender
    )`;

    try {
      return await db.request()
      .input('first_name', types.VarChar(30), this.firstName)
      .input('last_name', types.VarChar(30), this.lastName)
      .input('email_id', types.VarChar(255), this.emailId)
      .input('mobile_no', types.VarChar(10), this.mobileNumber)
      .input('dob', types.Date, this.dob)
      .input('title', types.VarChar(5), this.title)
      .input('password', types.VarChar(255), this.password)
      .input('role_id', types.Int, this.roleId)
      .input('profile_approved', types.Bit, false)
      .input('gender', types.VarChar(10), this.gender)
      .query(queryStmt);
    }
    catch(err) {
      throwError(err.originalError.info.message, 500);
    }
  };

  static async findUserByEmail(emailId) {
    const db = getDB();
    const queryStmt = `SELECT user_id FROM ${tableNames.USERS} WHERE email_id = @email_id`;
    try {
      return await db.request()
      .input('email_id', types.VarChar(255), emailId)
      .query(queryStmt);
    }
    catch(err){
      throwError(err.originalError.info.message, 500);
    }
  };

  static async findUserByMobile(mobileNo) {
    const db = getDB();
    const queryStmt = `SELECT user_id FROM ${tableNames.USERS} WHERE mobile_no = @mobile_no`;
    try {
      return await db.request()
      .input('mobile_no', types.VarChar(10), mobileNo)
      .query(queryStmt);
    }
    catch(err) {
      throwError(err.originalError.info.message, 500);
    }
  };
};