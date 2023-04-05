const fs = require('fs');

const createRegistrationDocDirectory = () => {
  fs.stat("./files/user-docs/registration-docs", err => {
      if(err){
        fs.mkdir("./files/user-docs/registration-docs", error => {
          if(error){
            console.log('Error occured while creating directory for registration docs...');
            console.log(error);
          }
        });
      }
  });
};
const createCoordinaturePhotoDirectory = () => {
  fs.stat("./files/user-docs/coordinator-photo", err => {
      if(err){
        fs.mkdir("./files/user-docs/coordinator-photo", error => {
          if(error){
            console.log('Error occured while creating directory for coordinator photo...');
            console.log(error);
          }
        });
      }
  });
};
const createCoordinatorMandateFormDirectory = () => {
  fs.stat("./files/user-docs/coordinator-mandate-form", err => {
      if(err){
        fs.mkdir("./files/user-docs/coordinator-mandate-form", error => {
          if(error){
            console.log('Error occured while creating directory for coordinator mandate form...');
            console.log(error);
          }
        });
      }
  });
};

const createCoordinatorSignatureDirectory = () => {
  fs.stat("./files/user-docs/coordinator-signature", err => {
      if(err){
        fs.mkdir("./files/user-docs/coordinator-signature", error => {
          if(error){
            console.log('Error occured while creating directory for coordinator signature...');
            console.log(error);
          }
        });
      }
  });
};

const createInstituteLogoDirectory = () => {
  fs.stat("./files/user-docs/institute-logo", err => {
      if(err){
        fs.mkdir("./files/user-docs/institute-logo", error => {
          if(error){
            console.log('Error occured while creating directory for institute logo...');
            console.log(error);
          }
        });
      }
  });
};

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
        createRegistrationDocDirectory();
        createCoordinatorMandateFormDirectory();
        createCoordinaturePhotoDirectory();
        createCoordinatorSignatureDirectory();
        createInstituteLogoDirectory();
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

exports.removeFileByPath = (filePath) => {
  fs.rmSync(filePath);
};