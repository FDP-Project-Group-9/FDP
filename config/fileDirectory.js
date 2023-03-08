const fs = require('fs');

const createUserDocsDirectory = () => {
    fs.stat("./files/user-docs", err => {
        if(err){
          fs.mkdir("./files/user-docs", error => {
            if(error){
              console.log('Error occured while creating directory for user docs...');
              console.log(error);
            }
          });
        }
      });
};

const createWorkshopReportsDirectory = () => {
    fs.stat("./files/workshop-docs/reports", err => {
        if(err){
          fs.mkdir("./files/workshop-docs/reports", error => {
            if(error){
              console.log('Error occured while creating directory for workshop reports...');
              console.log(error);
            }
          });
        }
      });
};

const createWorkshopMediaImagesDirectory = () => {
    fs.stat("./files/workshop-docs/media-images", err => {
        if(err){
            fs.mkdir("./files/workshop-docs/media-images", error => {
            if(error){
                console.log('Error occured while creating directory for media images...');
                console.log(error);
            }
            });
        }
    });
};

const createWorkshopImagesDirectory = () => {
    fs.stat("./files/workshop-docs/images", err => {
        if(err){
          fs.mkdir("./files/workshop-docs/images", error => {
            if(error){
              console.log('Error occured while creating directory for workshop images...');
              console.log(error);
            }
          });
        }
    });
};

const createWorkshopCertificateDirectory = () => {
    fs.stat("./files/workshop-docs/certificate", err => {
        if(err){
          fs.mkdir("./files/workshop-docs/certificate", error => {
            if(error){
              console.log('Error occured while creating directory for workshop certificate...');
              console.log(error);
            }
          });
        }
    });
};

const createWorkshopStmtOfExpenditure = () => {
    fs.stat("./files/workshop-docs/stmt-of-expenditure", err => {
        if(err){
          fs.mkdir("./files/workshop-docs/stmt-of-expenditure", error => {
            if(error){
              console.log('Error occured while creating directory for workshop stmt of expenditure...');
              console.log(error);
            }
          });
        }
    });
};

const createWorkshopDocsDirectory = () => {
    fs.stat("./files/workshop-docs", err => {
        if(err){
          fs.mkdir("./files/workshop-docs", error => {
            if(error){
              console.log('Error occured while creating directory for uploads...');
              console.log(error);
            }
          });
        }
        createWorkshopImagesDirectory();
        createWorkshopMediaImagesDirectory();
        createWorkshopCertificateDirectory();
        createWorkshopReportsDirectory();
        createWorkshopStmtOfExpenditure();
      });
};

exports.createFilesDirectory = () => {
    fs.stat("./files", (err) => {
        if(err){
          fs.mkdir("./files", {}, error => {
            if(error){
              console.log('Error occured while creating directory for uploads...');
              console.log(error);
            }
          });
        }
        createUserDocsDirectory();
        createWorkshopDocsDirectory();
      });
};

exports.removeFiles = (files) => {
    files.forEach(file => {
        fs.rm(file.path, {}, err => {
            if(err){
                console.log('error occured while deleting file!');
                console.log(err);
            }
        });
    });
};