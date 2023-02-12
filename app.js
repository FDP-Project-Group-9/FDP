const express=require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const uniqueFilename = require('unique-filename');


require('dotenv').config();

const onBoardingRoutes = require('./routes/ums');

const { connectDB } = require('./config/db');

const port = process.env.PORT || 5000;
const app = express();

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

// Use Routes
app.use('/ums', upload.array("docs"), onBoardingRoutes);

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
  app.listen(port, () => {
    fs.stat("./files", (err) => {
      if(err){
        fs.mkdir("./files", {}, error => {
          if(error){
            console.log('Error occured while creating directory for uploads...');
            console.log(error);
          }
        });
      }
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
    })
    console.log(`Server running on port ${port}`)
  });
});

