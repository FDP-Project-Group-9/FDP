const express=require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const passport=require('passport')

require('dotenv').config();

const onBoardingRoutes = require('./routes/ums');
const workshopRoutes = require('./routes/workshop');
const resourcePersonRoutes=require('./routes/resoucePerson')

const { connectDB } = require('./config/db');
const { passportMiddleware, authenticateJWT } = require('./middlewares/passport');
const { createTwilioSMSService } = require('./config/otp');
const { verifyCoordinatorRole, checkIfUserIsApproved } = require('./middlewares/userAuthorization');
const { createFilesDirectory, removeFiles } = require('./config/fileDirectory');

const port = process.env.PORT || 5000;
const app = express();

// Passport middleware
app.use(passport.initialize());

app.use(cors());

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use((req, res, next) => {
  passportMiddleware(passport, next);
})

// Use Routes
// user management routes
app.use('/ums', onBoardingRoutes);

// workshop routes  
app.use('/workshop',authenticateJWT, checkIfUserIsApproved, workshopRoutes);

// Resource Person routes
app.use('/resource-person', authenticateJWT, checkIfUserIsApproved, verifyCoordinatorRole, resourcePersonRoutes);

// error handler
app.use((error, req, res, next) => {
  if(error){

    if(error instanceof multer.MulterError){
      let msg = error.message;
      if(error.code == 'LIMIT_UNEXPECTED_FILE')
        msg = "Number of files is greater than limit!";

      const err = new Error();
      err.msg = msg;
      err.status = 413;
      error = err;
    }

    res.status(error.status || 500).json({
      errors: [{
        msg: error.msg || error,
        status: error.status || 500
      }]
    });
    if(req.originalUrl.includes("/workshop/upload")){
      removeFiles(Object.values(req.files)[0]);
    }

    if(req.originalUrl.includes("/ums/upload") && req.files) {
      removeFiles(Object.values(req.files).map(files => files[0]));
    }
  }
  next();
});


connectDB(() => {
  app.listen(port, async () => {

    createFilesDirectory();

    await createTwilioSMSService();
    console.log(`Server running on port ${port}`)
  });
});

