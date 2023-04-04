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
        if(req.originalUrl.includes("/ums/upload")){
          dir += "user-docs";
          if(req.originalUrl.includes("/registration-doc"))
            dir += '/registration-docs';
          if(req.originalUrl.includes("/mandate-docs")){
            switch(file.fieldname) {
              case USER.COORDINATOR_MANDATE_FORM: 
                dir += '/coordinator-mandate-form';
                break;
              case USER.COORDINATOR_PHOTO: 
                dir += '/coordinator-photo';
                break;
              case USER.COORDINATOR_SIGNATURE: 
                dir += '/coordinator-signature';
                break;
              case USER.INSTITUTE_LOGO: 
                dir += '/institute-logo';
                break;
            }
          }
          fileName = uniqueFilename(dir, file.originalname.split('.')[0] + '-' + (req.body['email_id'] || req.body.user_id));
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
                                }).fields([
                                  {
                                    name: USER.REGISTRATION_DOC,
                                    maxCount: 1
                                  },
                                  {
                                    name: USER.COORDINATOR_MANDATE_FORM,
                                    maxCount: 1
                                  },
                                  {
                                    name: USER.COORDINATOR_PHOTO,
                                    maxCount: 1
                                  },
                                  {
                                    name: USER.COORDINATOR_SIGNATURE,
                                    maxCount: 1
                                  },
                                  {
                                    name: USER.INSTITUTE_LOGO,
                                    maxCount: 1
                                  }
                                ]);
  
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
