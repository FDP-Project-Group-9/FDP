const { getDB } = require("../config/db");
const { dbTypes, throwError } = require("../utils/helper");
const { tableNames } = require("../utils/constants");

module.exports = class ResourcePersonDetails {
    constructor (data){
      Object.assign(this, data);
  };

    
    
      async addResourcePersonDetails () {
        const db = getDB();
        const queryStmt = `INSERT INTO ${tableNames.RESOURCE_PERSON} 
        (
          person_name,
          email_id,
          mobile_no, 
          designation,
          specialization_id,
          country,
          state_name,
          organization_name
        ) 
        values(
            @person_name,
            @email_id,
            @mobile_no, 
            @designation,
            @specialization_id,
            @country,
            @state_name,
            @organization_name
        )`;
    
        try {
          return await db.request()
          .input('person_name', dbTypes.VarChar(30), this.name)
          .input('email_id', dbTypes.VarChar(255), this.emailId)
          .input('mobile_no', dbTypes.VarChar(10), this.mobNo)
          .input('designation', dbTypes.VarChar(30), this.designation)
          .input('specialization_id', dbTypes.Int, this.specialization_id)
          .input('country', dbTypes.VarChar(50), this.country)
          .input('state_name', dbTypes.VarChar(50), this.state_name)
          .input('organization_name', dbTypes.VarChar(255), this.organization_name)
          .query(queryStmt);
        }
        catch(err) {
          throwError(err.originalError.info.message, 500);
        }
      };
    
    

     static async updateResourcePerson (id,data) {
        const db = getDB();
        const queryStmt = `UPDATE ${tableNames.RESOURCE_PERSON} SET
          person_name = @person_name,
          email_id = @email_id,
          mobile_no = @mobile_no,
          designation = @designation,
          specialization_id = @specialization_id,
          country = @country,
          state_name = @state_name,
          organization_name = @organization_name
          WHERE id=@id      
       `;
    
        try {
          return await db.request()
          .input('id',dbTypes.Int,id)
          .input('person_name', dbTypes.VarChar(30), data.name)
          .input('email_id', dbTypes.VarChar(255), data.emailId)
          .input('mobile_no', dbTypes.VarChar(10), data.mobNo)
          .input('designation', dbTypes.VarChar(30), data.designation)
          .input('specialization_id', dbTypes.Int, data.specialization_id)
          .input('country', dbTypes.VarChar(50), data.country)
          .input('state_name', dbTypes.VarChar(50), data.state_name)
          .input('organization_name', dbTypes.VarChar(255), data.organization_name)
          .query(queryStmt);
        }
        catch(err) {
          throwError(err.originalError.info.message, 500);
        }
      };





    static async findresourcePersonByMobile(mobileNo) {
        const db = getDB();
        const queryStmt = `SELECT * FROM ${tableNames.RESOURCE_PERSON} WHERE mobile_no = @mobile_no`;
        try {
          return await db.request()
          .input('mobile_no', dbTypes.VarChar(10), mobileNo)
          .query(queryStmt);
        }
        catch(err) {
          throwError(err.originalError.info.message, 500);
        }
      };

      static async findresourcePersonByEmail(emailId) {
        const db = getDB();
        const queryStmt = `SELECT * FROM ${tableNames.RESOURCE_PERSON} WHERE email_id = @email_id`;
        try {
          return await db.request()
          .input('email_id', dbTypes.VarChar(50), emailId)
          .query(queryStmt);
        }
        catch(err) {
          throwError(err.originalError.info.message, 500);
        }
      };

      static async getResourcePersonbyId(id) {
        const db = getDB();
        const queryStmt = `SELECT * FROM ${tableNames.RESOURCE_PERSON} WHERE id = @id`;
        try {
          return await db.request()
          .input('id', dbTypes.Int, id)
          .query(queryStmt);
        }
        catch(err) {
          throwError(err.originalError.info.message, 500);
        }
      };



      static async deleteResourcePersonbyId(id) {
        const db = getDB();
        const queryStmt = `DELETE FROM ${tableNames.RESOURCE_PERSON} WHERE id = @id`;
        try {
          return await db.request()
          .input('id', dbTypes.Int, id)
          .query(queryStmt);
        }
        catch(err) {
          throwError(err.originalError.info.message, 500);
        }
      };

    
    static async applyFiltersonResourcePerson(data,limit){
      const db = getDB();
      console.log(data)
      let  queryStmt = `SELECT * FROM ${tableNames.RESOURCE_PERSON}`;

      if(data.designation!=undefined || data.specialization_id!=undefined || data.country!=undefined || data.state_name!=undefined || data.organization_name!=undefined){
        queryStmt+=` WHERE 1=1`;
      }
      // if(data.designation!=undefined){
      //    queryStmt+=` AND designation =`+data.designation;
      // }
      // if(data.specialization_id!=undefined){
      //   queryStmt+=` AND specialization_id=`+ data.specialization_id;
      // }
      // if(data.country!=undefined){
      //   queryStmt+=` AND country=`+data.country;
      // }
      // if(data.state_name!=undefined){
      //   queryStmt+=` AND state_name=`+data.state_name;
      // }
      // if(data.organization_name!=undefined){
      //   queryStmt+=` AND organization_name=`+data.organization_name;
      // }



       if(data.designation!=undefined){
         queryStmt+=` AND designation =@designation`
      }
      if(data.specialization_id!=undefined){
        queryStmt+=` AND specialization_id=@specialization_id`;
      }
      if(data.country!=undefined){
        queryStmt+=` AND country=@country`;
      }
      if(data.state_name!=undefined){
        queryStmt+=` AND state_name@state_name=`;
      }
      if(data.organization_name!=undefined){
        queryStmt+=` AND organization_name=@organization_name`;
      }
      // queryStmt+=` LIMIT `+limit ;
      try {
        return await db.request()
        .input('designation', dbTypes.VarChar(30), data.designation)
        .input('specialization_id', dbTypes.Int, data.specialization_id)
        .input('country', dbTypes.VarChar(50), data.country)
        .input('state_name', dbTypes.VarChar(50), data.state_name)
        .input('organization_name', dbTypes.VarChar(255), data.organization_name)
        .query(queryStmt);
      }
      catch(err) {
        throwError(err.originalError.info.message, 500);
      }
    }
};