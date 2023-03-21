const express = require("express");

const { deleteWorkshopImage, deleteWorkshopMediaImage, deleteWorkshopReport, deleteWorkshopStmtOfExpenditure, deleteWorkshopCertificate } = require("../controllers/workshopDocs");

const routes = express.Router();

//route to delete workshop image
routes.delete("/image", deleteWorkshopImage);

//route to delete workshop media image
routes.delete("/media-image", deleteWorkshopMediaImage);

//route to delete workshop report
routes.delete("/report", deleteWorkshopReport);

//route to delete workshop report
routes.delete("/certificate", deleteWorkshopCertificate);

//route to delete workshop report
routes.delete("/stmt-expenditure", deleteWorkshopStmtOfExpenditure);

module.exports = routes;