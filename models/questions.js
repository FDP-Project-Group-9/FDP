const { getDB } = require("../config/db");
const { dbTypes, throwError } = require("../utils/helper");
const { colNames } = require("../utils/constants").questions;
const { colNames:quizDetails } = require("../utils/constants").quizes;
const { tableNames } = require("../utils/constants");

module.exports = class Questions {
    constructor(data){
        Object.assign(this, data);
        
    };


    async addQuestionDetails() {
        const db = getDB();
        const queryStmt = `INSERT INTO ${tableNames.QUESTIONS}
        (
            ${colNames.quiz_id},
            ${colNames.questStmt},
            ${colNames.option1},
            ${colNames.option2},
            ${colNames.option3},
            ${colNames.option4},
            ${colNames.answer}
            
        )
        VALUES 
        (
            ${'@' + colNames.quiz_id},
            ${'@' + colNames.questStmt},
            ${'@' + colNames.option1},
            ${'@' + colNames.option2},
            ${'@' + colNames.option3},
            ${'@' + colNames.option4},
            ${'@' + colNames.answer}
        )`;

        try{
            console.log(this[colNames.questStmt])
            return await db.request()
            .input(colNames.quiz_id, dbTypes.Int, this.quiz_id)
            .input(colNames.questStmt, dbTypes.VarChar(255), this.questStmt)
            .input(colNames.option1, dbTypes.VarChar(255), this.option1)
            .input(colNames.option2, dbTypes.VarChar(255), this.option2)
            .input(colNames.option3, dbTypes.VarChar(255), this.option3)
            .input(colNames.option4, dbTypes.VarChar(255), this.option4)
            .input(colNames.answer, dbTypes.Int, this[colNames.answer])
            .query(queryStmt);
        }
        catch(err){
            throwError(err.originalError.info.message, 500);
        }

    };


    static async findQuestionStatement(data){
        const db=getDB()
        const queryStmt=`SELECT * FROM ${tableNames.QUESTIONS} WHERE ${colNames.questStmt}=${'@' + colNames.questStmt}`;
        try{
            return await db.request()
            .input(colNames.questStmt,dbTypes.VarChar(255),data)
            .query(queryStmt);
        }
        catch(err){
            throwError(err.originalError.info.message, 500);
        }
    }

    static async findQuestionStatementById(data){
        const db=getDB()
        const queryStmt=`SELECT * FROM ${tableNames.QUESTIONS} WHERE ${colNames.question_id}=${'@' + colNames.question_id}`;
        try{
            return await db.request()
            .input(colNames.question_id,dbTypes.Int,data)
            .query(queryStmt);
        }
        catch(err){
            throwError(err.originalError.info.message, 500);
        }
    }

    static async updateQuestion(id,data) {
        const db = getDB();
        const queryStmt = `UPDATE ${tableNames.QUESTIONS} SET
            ${colNames.questStmt} = ${'@' + colNames.questStmt},
            ${colNames.option1} = ${'@' + colNames.option1},
            ${colNames.option2} = ${'@' + colNames.option2},
            ${colNames.option3} = ${'@' + colNames.option3},
            ${colNames.option4} = ${'@' + colNames.option4},
            ${colNames.answer} = ${'@' + colNames.answer}
          WHERE    ${colNames.question_id} = ${'@' + colNames.question_id}
       `;
    
        try {
          return await db.request()
          .input(colNames.question_id,dbTypes.Int,id)
          .input(colNames.questStmt, dbTypes.VarChar(255), data.questStmt)
          .input(colNames.option1, dbTypes.VarChar(255), data.option1)
          .input(colNames.option2, dbTypes.VarChar(255), data.option2)
          .input(colNames.option3, dbTypes.VarChar(255), data.option3)
          .input(colNames.option4, dbTypes.VarChar(255), data.option4)
          .input(colNames.answer, dbTypes.Int, data.answer)
          .query(queryStmt);
        }
        catch(err) {
          throwError(err.originalError.info.message, 500);
        }
      };


       static async deleteAllQuestions(id){
        const db=getDB();
        const queryStmt = `DELETE FROM ${tableNames.QUESTIONS} WHERE  ${colNames.quiz_id} = ${'@' + colNames.quiz_id}`;
        try {
            return await db.request()
            .input('quiz_id',dbTypes.Int,id)
            .query(queryStmt);
          }
          catch(err) {
            throwError(err.originalError.info.message, 500);
          }
      }

      static async deleteQuestionByID(id){
        const db=getDB();
        const queryStmt = `DELETE FROM ${tableNames.QUESTIONS} WHERE  ${colNames.question_id} = ${'@' + colNames.question_id}`;
        try {
            return await db.request()
            .input('question_id',dbTypes.Int,id)
            .query(queryStmt);
          }
          catch(err) {
            throwError(err.originalError.info.message, 500);
          }
      }

        static async getQuestionByFilters(offset=0,limit=10,id){
             const db=getDB();
             let queryStmt = `SELECT 
             ${tableNames.QUIZ}.${quizDetails.quiz_id},
             ${tableNames.QUIZ}.${quizDetails.quiz_name},
             ${tableNames.QUESTIONS}.${colNames.question_id},
             ${tableNames.QUESTIONS}.${colNames.option1},
             ${tableNames.QUESTIONS}.${colNames.option2},
             ${tableNames.QUESTIONS}.${colNames.option3},
             ${tableNames.QUESTIONS}.${colNames.option4},
             ${tableNames.QUESTIONS}.${colNames.questStmt},
             ${tableNames.QUESTIONS}.${colNames.answer}
             FROM
             ${tableNames.QUIZ}
             LEFT JOIN 
             ${tableNames.QUESTIONS}
             ON
             ${tableNames.QUIZ}.${quizDetails.quiz_id}=${tableNames.QUESTIONS}.${colNames.quiz_id}
             WHERE 
             ${colNames.quiz_id} = ${id}`;
           
             queryStmt += `
             ORDER BY ${colNames.question_id} DESC
             OFFSET ${offset} ROWS
             FETCH NEXT ${limit} ROWS ONLY
             `;

             let queryStmt2=`SELECT count(*) as total_rows FROM 
         ${tableNames.QUIZ}
        LEFT JOIN
        ${tableNames.QUESTIONS}
        ON
        ${tableNames.QUIZ}.${quizDetails.quiz_id}=${tableNames.QUESTIONS}.${colNames.quiz_id}
        WHERE 
        ${quizDetails.quiz_id} = ${id}`;

        try {
             return await Promise.all([ 
            db.request()
                .query(queryStmt),
            db.request()
                .query(queryStmt2)
             ])
         }
              catch(err) {
                throwError(err.originalError.info.message, 500);
              }
        }


    };