const express = require('express');
const { getWorkshopMediaImage, getWorkshopImage, getWorkshopReport, getWorkshopStmtOfExpenditure, getWorkshopCertificate, getWorkshopBrochure } = require('../controllers/workshopDocs');

const routes = express.Router();

routes.get("/media-image/:fileId", getWorkshopMediaImage);

routes.get("/image/:fileId", getWorkshopImage);

routes.get("/report/:fileId", getWorkshopReport);

routes.get("/stmt-of-expenditure/:fileId", getWorkshopStmtOfExpenditure);

routes.get("/certificate/:fileId", getWorkshopCertificate);

routes.get("/brochure/:fileId", getWorkshopBrochure);

module.exports = routes;