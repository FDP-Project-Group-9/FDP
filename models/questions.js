const { getDB } = require("../config/db");
const { dbTypes, throwError } = require("../utils/helper");
const { colNames } = require("../utils/constants").questions;
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

};