const express = require('express');

const { 
    addWorkshopMediaImages, 
    addWorkshopImages,
    addWorkshopReport,
    addWorkshopStmtOfExpenditure
} = require('../controllers/workshopDocs');
const { 
    workshopMediaImages,
    workshopImages,
    workshopStmtOfExpenditure,
    workshopReport
} = require('../config/fileUploads');
const { checkIfWorkshopExists } = require('../middlewares/workshop');


const routes = express.Router();

// add media images to server
routes.put("/media-images", workshopMediaImages, checkIfWorkshopExists, addWorkshopMediaImages);

//add workshop images to server
routes.put("/images", workshopImages, checkIfWorkshopExists, addWorkshopImages);

//add workshop report to server
routes.put("/report", workshopReport, checkIfWorkshopExists, addWorkshopReport);

//add workshop statement of expenditure to server
routes.put("/stmt-expenditure", workshopStmtOfExpenditure, checkIfWorkshopExists, addWorkshopStmtOfExpenditure);

module.exports = routes;