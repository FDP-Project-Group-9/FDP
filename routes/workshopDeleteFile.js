const express = require("express");

const { deleteWorkshopImage, deleteWorkshopMediaImage, deleteWorkshopReport, deleteWorkshopStmtOfExpenditure, deleteWorkshopCertificate, deleteWorkshopBrochure } = require("../controllers/workshopDocs");
const { workshopDocumentsDeletionValidationRules } = require("../middlewares/workshopCreationValidations");
const { validationErrorHandler } = require("../utils/helper");

const routes = express.Router();

//route to delete workshop image
routes.delete("/image", workshopDocumentsDeletionValidationRules(), validationErrorHandler, deleteWorkshopImage);

//route to delete workshop media image
routes.delete("/media-image", workshopDocumentsDeletionValidationRules(), validationErrorHandler, deleteWorkshopMediaImage);

//route to delete workshop report
routes.delete("/report", workshopDocumentsDeletionValidationRules(), validationErrorHandler, deleteWorkshopReport);

//route to delete workshop report
routes.delete("/certificate", workshopDocumentsDeletionValidationRules(), validationErrorHandler, deleteWorkshopCertificate);

//route to delete workshop report
routes.delete("/stmt-expenditure", workshopDocumentsDeletionValidationRules(), validationErrorHandler, deleteWorkshopStmtOfExpenditure);

routes.delete("/brochure", workshopDocumentsDeletionValidationRules(), validationErrorHandler, deleteWorkshopBrochure)

module.exports = routes;