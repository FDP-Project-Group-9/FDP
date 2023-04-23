const { getDB } = require("../config/db");
const { dbTypes, throwError } = require("../utils/helper");
const { colNames } = require("../utils/constants").quizes;
const { tableNames } = require("../utils/constants");
const {colNames: workshopDetails} = require('../utils/constants').workshop_details
const {colNames: questionDetails} = require('../utils/constants').questions

module.exports = class quizDetails {
    constructor (data){
        Object.assign(this, data);
    };

    async addQuizDetails() {
        console.log(this.quiz_name)
        const db = getDB();
        const queryStmt = `INSERT INTO ${tableNames.QUIZ}
        (
            ${colNames.quiz_name},
            ${colNames.workshopId}
        )
        VALUES 
        (
            ${'@' + colNames.quiz_name},
            ${'@' + colNames.workshopId}
        )`;
      console.log(this)

        try{
            return await db.request()
            .input(colNames.quiz_name, dbTypes.VarChar(50), this.quiz_name)
            .input(colNames.workshopId, dbTypes.Int, this.workshopId)
            .query(queryStmt);
        }
        catch(err){
            console.log(err)
            throwError(err.originalError.info.message, 500);
        }

    };

    static async getquizDetails(workshopId){
        const db=getDB();
        const queryStmt=`SELECT * FROM ${tableNames.QUIZ} WHERE ${colNames.workshopId}=${workshopId}`;
        try{
            return await db.request()
            .query(queryStmt);
        }
        catch(err){
            throwError(err.originalError.info.message, 500);
        }
    }

    static async updateworkshopDetails(data){
        const db=getDB();
        const queryStmt=`UPDATE ${tableNames.WORKSHOP_DETAILS} SET
        ${workshopDetails.quizId}=   ${'@' + workshopDetails.quizId},
        ${workshopDetails.quizGenerated}=   ${'@' + workshopDetails.quizGenerated} 
        WHERE
        ${colNames.workshopId}=${'@' + colNames.workshopId}    
       `;
        try{
            return await db.request()
            .input(workshopDetails.quizId,dbTypes.Int,data.quiz_id)
            .input(colNames.workshopId,dbTypes.Int,data.workshopId)
            .input(workshopDetails.quizGenerated,dbTypes.Int,data.quizGenerated)
            .query(queryStmt);
        }
        catch(err){
            console.log(err)
            throwError(err.originalError.info.message, 500);
        }
    }

    static async getQuizIdByQuizName(data){
        const db=getDB()
        const queryStmt=`SELECT * FROM ${tableNames.QUIZ} WHERE ${colNames.quiz_name}=${'@' + colNames.quiz_name}`;
        try{
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
          WHERE ${colNames.workshopId} = ${id}      
       `;
    
        try {
          return await db.request()
          .input(colNames.quiz_name,dbTypes.VarChar(50),data)
          .query(queryStmt);
        }
        catch(err) {
          throwError(err.originalError.info.message, 500);
        }
      };


    static async updateTotalQuestions(workshopId,quizId){
        const db=getDB();
        const query=`SELECT count(*) AS total_questions FROM ${tableNames.QUESTIONS} WHERE ${questionDetails.quiz_id} = ${quizId} `
        try{
            const result=await db.request()
                          .query(query);
            const queryStmt = `UPDATE  ${tableNames.QUIZ} SET  ${colNames.totalQuestions}=   ${result.recordset[0].total_questions}
            WHERE ${colNames.workshopId} = ${workshopId}     `;  
            try {
                return await db.request()
                .query(queryStmt);
              }
              catch(err) {
                throwError(err.originalError.info.message, 500);
              } 
            }
        catch(err){
            throwError(err.originalError.info.message, 500);
        }
       
    }
    
      static async deleteQuiz(id){
        const db=getDB();
        const queryStmt = `DELETE FROM ${tableNames.QUIZ} WHERE ${colNames.workshopId}=@id`;
        try {
            return await db.request()
            .input('id',dbTypes.Int,id)
            .query(queryStmt);
          }
          catch(err) {
            throwError(err.originalError.info.message, 500);
          }
      }


      
      static async getQuizDetailsForParticipant(offset=0,limit=10,id){
      
        const db=getDB();
        let queryStmt = `SELECT 
        ${tableNames.QUIZ}.${colNames.quiz_id},
        ${tableNames.QUIZ}.${colNames.quiz_name},
        ${tableNames.QUESTIONS}.${questionDetails.question_id},
        ${tableNames.QUESTIONS}.${questionDetails.option1},
        ${tableNames.QUESTIONS}.${questionDetails.option2},
        ${tableNames.QUESTIONS}.${questionDetails.option3},
        ${tableNames.QUESTIONS}.${questionDetails.option4},
        ${tableNames.QUESTIONS}.${questionDetails.questStmt},
        ${tableNames.QUESTIONS}.${questionDetails.answer}
        FROM
        ${tableNames.QUIZ}
        LEFT JOIN
        ${tableNames.QUESTIONS}
        ON
        ${tableNames.QUIZ}.${colNames.quiz_id}=${tableNames.QUESTIONS}.${questionDetails.quiz_id}
        WHERE 
        ${questionDetails.quiz_id} = ${id}`;
      
        queryStmt += `
        ORDER BY ${questionDetails.question_id} DESC
        OFFSET ${offset} ROWS
        FETCH NEXT ${limit} ROWS ONLY
        `;

        let queryStmt2=`SELECT count(*) as total_rows FROM 
         ${tableNames.QUIZ}
        LEFT JOIN
        ${tableNames.QUESTIONS}
        ON
        ${tableNames.QUIZ}.${colNames.quiz_id}=${tableNames.QUESTIONS}.${questionDetails.quiz_id}
        WHERE 
        ${questionDetails.quiz_id} = ${id}`;

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


    static async getAnswersForQuiz(id){
        const db=getDB();
        let queryStmt = `SELECT 
        ${tableNames.QUESTIONS}.${questionDetails.question_id},
        ${tableNames.QUESTIONS}.${questionDetails.answer}
        FROM
        ${tableNames.QUESTIONS}
        WHERE 
        ${questionDetails.quiz_id} = ${id}`;
        queryStmt += `
        ORDER BY ${questionDetails.question_id} ASC
        `;
     
        try {
             return await db.request()
                .query(queryStmt)
            
         }
         catch(err) {
           throwError(err.originalError.info.message, 500);
         }
    }
};