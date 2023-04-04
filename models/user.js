const { getDB } = require('../config/db');
const { dbTypes, throwError } = require('../utils/helper');
const { tableNames } = require("../utils/constants");
const { colNames } = require('../utils/constants').user;

module.exports = class User {

  constructor(roleId, firstName, lastName, title, dob, gender, emailId, mobileNumber, password, profile_approved){
    this.roleId = roleId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.title = title;
    this.dob = dob;
    this.gender = gender;
    this.emailId = emailId;
    this.mobileNumber = mobileNumber;
    this.password = password;
    this.profile_approved = profile_approved;
  }


  async save () {
    const db = getDB();
    const queryStmt = `INSERT INTO ${tableNames.USERS} 
    (
      first_name,
      last_name, 
      email_id,
      mobile_no, 
      dob,
      title,
      password,
      role_id,
      profile_approved,
      gender
    ) 
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
      .input('profile_approved', dbTypes.Bit, this.profile_approved)
      .input('gender', dbTypes.VarChar(10), this.gender)
      .query(queryStmt);
    }
    catch(err) {
      throwError(err.originalError.info.message, 500);
    }
  };

  static async findUserByEmail(emailId) {
    const db = getDB();
    const queryStmt = `SELECT 
      user_id,
      first_name,
      last_name, 
      email_id,
      mobile_no, 
      dob,
      title,
      password,
      ${tableNames.USERS}.role_id,
      profile_approved,
      gender,
      role_name
    FROM ${tableNames.USERS} 
    INNER JOIN ${tableNames.ROLES}
    ON ${tableNames.USERS}.role_id = ${tableNames.ROLES}.role_id AND email_id = @email_id`;
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
    const queryStmt = `SELECT 
      user_id,
      first_name,
      last_name, 
      email_id,
      mobile_no, 
      dob,
      title,
      password,
      ${tableNames.USERS}.role_id,
      profile_approved,
      gender,
      role_name
    FROM ${tableNames.USERS} 
    INNER JOIN ${tableNames.ROLES}
    ON ${tableNames.USERS}.role_id = ${tableNames.ROLES}.role_id AND user_id = @user_id`;
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

  static async updateUserDetails (userId, data) {
    const db = getDB();
    const queryStmt = `UPDATE
      ${tableNames.USERS}
      SET
      ${colNames.title} = ${'@' + colNames.title},
      ${colNames.dob} = ${'@' + colNames.dob},
      ${colNames.mobileNo} = ${'@' + colNames.mobileNo},
      ${colNames.gender} = ${'@' + colNames.gender}
      WHERE
      ${colNames.userId} = ${'@' + colNames.userId}
    `;
    try {
      return await db.request()
      .input(colNames.title, dbTypes.VarChar(5), data[colNames.title])
      .input(colNames.dob, dbTypes.Date, data[colNames.dob])
      .input(colNames.mobileNo, dbTypes.VarChar(10), data[colNames.mobileNo])
      .input(colNames.gender, dbTypes.VarChar(10), data[colNames.gender])
      .input(colNames.userId, dbTypes.Int, userId)
      .query(queryStmt);
    }
    catch(err) {
      throwError(err.originalError.info.message, 500);
    }
  };

  static async findAllCoordinators(offset = 0, limit = 10, profileStatus) {
    const db = getDB();
    let profileApprovedVal = true;
    let queryStmt = `SELECT 
      ${tableNames.USERS}.${colNames.userId},
      ${colNames.title},
      ${colNames.firstName},
      ${colNames.lastName},
      ${colNames.profileApproved},
      ${colNames.emailId}
      FROM
      ${tableNames.USERS}
      INNER JOIN
      ${tableNames.ROLES}
      ON
      ${tableNames.USERS}.${colNames.roleId} = ${tableNames.ROLES}.${colNames.roleId}
      WHERE
      ${tableNames.ROLES}.${colNames.roleName} = 'coordinator'
    `;

    let queryStmt2 = `SELECT 
      count(*) as total_count 
      FROM ${tableNames.USERS} 
      INNER JOIN
      ${tableNames.ROLES}
      ON
      ${tableNames.USERS}.${colNames.roleId} = ${tableNames.ROLES}.${colNames.roleId}
      WHERE
      ${tableNames.ROLES}.${colNames.roleName} = 'coordinator'
    `;

    if(profileStatus) {
      if(profileStatus.toLowerCase() === 'approved') {
        profileApprovedVal = true;
        queryStmt += ` AND ${tableNames.USERS}.${colNames.profileApproved} = ${'@' + colNames.profileApproved}`;
        queryStmt2 += ` AND ${tableNames.USERS}.${colNames.profileApproved} = ${'@' + colNames.profileApproved}`;
      }
      else if(profileStatus.toLowerCase() === 'rejected'){
        profileApprovedVal = false;
        queryStmt += ` AND ${tableNames.USERS}.${colNames.profileApproved} = ${'@' + colNames.profileApproved}`;
        queryStmt2 += ` AND ${tableNames.USERS}.${colNames.profileApproved} = ${'@' + colNames.profileApproved}`;
      }
      else if(profileStatus.toLowerCase() === 'pending'){
        profileApprovedVal = null;
        queryStmt += ` AND ${tableNames.USERS}.${colNames.profileApproved} IS NULL`;
        queryStmt2 += ` AND ${tableNames.USERS}.${colNames.profileApproved} IS NULL`;
      }
    }

    queryStmt += `
      ORDER BY ${tableNames.USERS}.${colNames.userId} DESC
      OFFSET ${offset} ROWS
      FETCH NEXT ${limit} ROWS ONLY
    `;

    try {
      return await Promise.all([
        db.request()
        .input(colNames.profileApproved, dbTypes.Bit, profileApprovedVal)
        .query(queryStmt),
        db.request()
        .input(colNames.profileApproved, dbTypes.Bit, profileApprovedVal)
        .query(queryStmt2)
      ]);
    }
    catch(err){
      throwError(err.originalError.info.message, 500);
    }
  };
};