const { getDB } = require("../config/db");
const { dbTypes, throwError } = require("../utils/helper");
const { colNames } = require("../utils/constants").quizes;
const { tableNames } = require("../utils/constants");

module.exports = class quizDetails {
    constructor(quiz_name){
        this.quiz_name=quiz_name
    };

    async addQuizDetails() {
        const db = getDB();
        const queryStmt = `INSERT INTO ${tableNames.QUIZ}
        (
            ${colNames.quiz_name}
        )
        VALUES 
        (
            ${'@' + colNames.quiz_name}
        )`;

        try{
            console.log(this[colNames.quiz_name])
            console.log(queryStmt)
            return await db.request()
            .input(colNames.quiz_name, dbTypes.VarChar(50), this[colNames.quiz_name])
            .query(queryStmt);
        }
        catch(err){
            throwError(err.originalError.info.message, 500);
        }

    };

    static async getQuizIdByQuizName(data){
        const db=getDB()
        const queryStmt=`SELECT * FROM ${tableNames.QUIZ} WHERE ${colNames.quiz_name}=${'@' + colNames.quiz_name}`;
        try{
            console.log(queryStmt)
            console.log(data)
            return await db.request()
            .input(colNames.quiz_name,dbTypes.VarChar(50),data)
            .query(queryStmt);
        }
        catch(err){
            throwError(err.originalError.info.message, 500);
        }
    }


    static async updateQuizName (id,data) {
        const db = getDB();
        const queryStmt = `UPDATE ${tableNames.QUIZ} SET
        ${colNames.quiz_name}=   ${'@' + colNames.quiz_name}
          WHERE id = @id      
       `;
    
        try {
          return await db.request()
          .input('id',dbTypes.Int,id)
          .input(colNames.quiz_name,dbTypes.VarChar(50),data)
          .query(queryStmt);
        }
        catch(err) {
          throwError(err.originalError.info.message, 500);
        }
      };

};