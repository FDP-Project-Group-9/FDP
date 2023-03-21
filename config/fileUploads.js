const multer = require('multer');
const path = require('path');
const uniqueFilename = require('unique-filename');

const { fileSize, fileUploadNames } = require('../utils/constants');

const { 
    WORKSHOP,
    USER
} = fileUploadNames;

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        let index = __dirname.lastIndexOf(`\\`);
        let rootDir = __dirname.slice(0, index - __dirname.length);
        let dir = path.join(rootDir + '/files');
        cb(null, dir); 
    },
    filename: (req, file, cb) => {
        let dir = "", fileName = ""
        if(req.originalUrl === "/ums/upload-files"){
        dir += "user-docs";
        fileName = uniqueFilename(dir, file.originalname.split('.')[0] + '-' + req.body['email_id']);
        }
        else if(req.originalUrl.includes("/workshop/upload")) {
            dir += "workshop-docs";
        if(req.originalUrl.includes("/media-images"))
            dir += "/media-images";
        else if(req.originalUrl.includes("/images"))
            dir += "/images";
        else if(req.originalUrl.includes("/report"))
            dir += "/reports";
        else if(req.originalUrl.includes("/stmt-expenditure"))
            dir += "/stmt-of-expenditure";

        fileName = uniqueFilename(dir, file.originalname.split('.')[0] + '-' + req.body['workshop_id'])
        }
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
  
  //multer function for user docuements
  exports.uploadUserDocs = multer({
                                  storage: fileStorage, 
                                  fileFilter: fileFilter,
                                  limits: {
                                    fileSize: fileSize
                                  }
                                }).array("docs");
  
  //multer function for workshop documents
  exports.workshopImages = multer({
                                  storage: fileStorage,
                                  fileFilter: fileFilter,
                                  limits: {
                                    fileSize: fileSize
                                  }
                              }).fields([
                                { name: WORKSHOP.IMAGES, maxCount: 5}
                              ]);

  exports.workshopMediaImages = multer({  
                                  storage: fileStorage,
                                  fileFilter: fileFilter,
                                  limits: {
                                    fileSize: fileSize
                                  }
                              }).fields([
                                { name: WORKSHOP.MEDIA_IMAGES, maxCount: 5},
                              ]);
                              
  exports.workshopReport = multer({
                                  storage: fileStorage,
                                  fileFilter: fileFilter,
                                  limits: {
                                    fileSize: fileSize
                                  }
                              }).fields([
                                { name: WORKSHOP.REPORT, maxCount: 1}
                              ]);

  exports.workshopStmtOfExpenditure = multer({
                                  storage: fileStorage,
                                  fileFilter: fileFilter,
                                  limits: {
                                    fileSize: fileSize
                                  }
                              }).fields([
                                { name: WORKSHOP.STMT_OF_EXPENDITURE, maxCount: 1}
                              ]);
