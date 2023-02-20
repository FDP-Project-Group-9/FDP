const { getDB } = require('../config/db');
const { dbTypes, tableNames, throwError } = require('../utils/utils');

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
    const queryStmt = `INSERT INTO ${tableNames.USERS} (first_name, last_name, email_id,mobile_no, dob,title,password,role_id,profile_approved,gender) 
    values(
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
      .input('first_name', dbTypes.VarChar(30), this.firstName)
      .input('last_name', dbTypes.VarChar(30), this.lastName)
      .input('email_id', dbTypes.VarChar(255), this.emailId)
      .input('mobile_no', dbTypes.VarChar(10), this.mobileNumber)
      .input('dob', dbTypes.Date, this.dob)
      .input('title', dbTypes.VarChar(5), this.title)
      .input('password', dbTypes.VarChar(255), this.password)
      .input('role_id', dbTypes.Int, this.roleId)
      .input('profile_approved', dbTypes.Bit, false)
      .input('gender', dbTypes.VarChar(10), this.gender)
      .query(queryStmt);
    }
    catch(err) {
      throwError(err.originalError.info.message, 500);
    }
  };

  static async findUserByEmail(emailId) {
    const db = getDB();
    const queryStmt = `SELECT * FROM ${tableNames.USERS} WHERE email_id = @email_id`;
    try {
      return await db.request()
      .input('email_id', dbTypes.VarChar(255), emailId)
      .query(queryStmt);
    }
    catch(err){
      throwError(err.originalError.info.message, 500);
    }
  };

  static async findUserById(user_id) {
    const db = getDB();
    const queryStmt = `SELECT * FROM ${tableNames.USERS} WHERE user_id = @user_id`;
    try {
      return await db.request()
      .input('user_id', dbTypes.Int, user_id)
      .query(queryStmt);
    }
    catch(err){
      throwError(err.originalError.info.message, 500);
    }
  };

  static async updateUserRoleId(profile_approved,user_id) {
    const db = getDB();
    const queryStmt = `UPDATE ${tableNames.USERS} SET profile_approved=@profile_approved WHERE user_id = @user_id`;
    try {
      return await db.request()
      .input('profile_approved',dbTypes.Bit,profile_approved)
      .input('user_id', dbTypes.Int, user_id)
      .query(queryStmt);
    }
    catch(err){
      return err
      // throwError(err.originalError.info.message, 500);
    }
  };

  

  static async findUserByMobile(mobileNo) {
    const db = getDB();
    const queryStmt = `SELECT * FROM ${tableNames.USERS} WHERE mobile_no = @mobile_no`;
    try {
      return await db.request()
      .input('mobile_no', dbTypes.VarChar(10), mobileNo)
      .query(queryStmt);
    }
    catch(err) {
      throwError(err.originalError.info.message, 500);
    }
  };

  static async findAllAdministrators() {
    const db = getDB();
    const queryStmt = `SELECT email_id FROM ${tableNames.USERS} WHERE role_id = 1`;
    try{
      return await db.request()
      .query(queryStmt);
    }
    catch(err){
      throwError(err.originalError.info.message, 500);
    };
  };
};