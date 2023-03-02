const express=require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const uniqueFilename = require('unique-filename');
const passport=require('passport')


require('dotenv').config();

const onBoardingRoutes = require('./routes/ums');
const workshopRoutes = require('./routes/workshop');
const resourcePersonRoutes=require('./routes/resoucePerson')
const quizRoutes=require('./routes/quiz')

const { connectDB } = require('./config/db');
const { passportMiddleware, authenticateJWT } = require('./middlewares/passport');
const { createTwilioSMSService } = require('./utils/otp');
const { verifyCoordinatorRole } = require('./middlewares/userAuthorization');

const port = process.env.PORT || 5000;
const app = express();

// Passport middleware
app.use(passport.initialize());

// Passport Config

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    let dir = path.join(__dirname + '/files');
    cb(null, dir); 
  },
  filename: (req, file, cb) => {
    let dir = "";
    if(req.originalUrl === "/ums/upload-files"){
      dir += "user-docs";
    }
    const fileName = uniqueFilename(dir, file.originalname.split('.')[0] + '-' + req.body['email_id']);
    cb(null, fileName + '.' + file.originalname.split('.')[1]);
  }
});

const fileFilter = (req, file, cb) => {
  if(
    file.mimetype === "image/png"  || 
    file.mimetype === "image/jpg" || 
    file.mimetype === "image/jpeg" ||
    file.mimetype === "application/pdf"
  ){
    cb(null, true);
  }
  else
    cb({ msg: "File type not supported!", status: 415}, false);
};

const upload = multer({storage: fileStorage, fileFilter: fileFilter });
//enabling cors
app.use(cors());

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use((req, res, next) => {
  passportMiddleware(passport, next);
})

// Use Routes
// user management routes
app.use('/ums', upload.array("docs"), onBoardingRoutes);

// workshop routes
app.use('/workshop', authenticateJWT, workshopRoutes);

// Resource Person routes
app.use('/resource-person', authenticateJWT,verifyCoordinatorRole,resourcePersonRoutes);

// error handler
app.use((error, req, res, next) => {
  if(error){
    console.log(error);
    res.status(error.status || 500).json({
      errors: [{
        msg: error.msg || error,
        status: error.status
      }]
    });
  }
  next();
});


connectDB(() => {
  app.listen(port, async () => {

    fs.stat("./files", (err) => {
      if(err){
        fs.mkdir("./files", {}, error => {
          if(error){
            console.log('Error occured while creating directory for uploads...');
            console.log(error);
          }
        });
      };

      fs.stat("./files/user-docs", err => {
        if(err){
          fs.mkdir("./files/user-docs", error => {
            if(error){
              console.log('Error occured while creating directory for uploads...');
              console.log(error);
            }
          });
        }
      })
    });

    await createTwilioSMSService();
    console.log(`Server running on port ${port}`)
  });
});

