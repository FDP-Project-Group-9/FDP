const express=require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const sql = require('mssql');
require('dotenv').config();

const onBoardingRoutes = require('./routes/ums');


const { connectDB, getDB }= require('./config/db');

const port = process.env.PORT || 5000;
const app = express();

//enabling cors
app.use(cors());

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Use Routes
app.use('/ums', onBoardingRoutes);
app.use((error, req, res, next) => {
  if(error){
    res.status(error.status).json({
      errors: [{
        msg: error.msg,
        status: error.status
      }]
    });
  }
  next();
});


connectDB(() => {
  app.listen(port, () => console.log(`Server running on port ${port}`));
});

