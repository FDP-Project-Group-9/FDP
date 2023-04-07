const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require('path');
const uniqueFilename = require('unique-filename');
const { throwError } = require("../utils/helper");
const { removeFileByPath } = require("../config/fileDirectory");

const formatDate = (date) => {
    if(!date)
        return "";
    const newDate = new Date(date);
    const options = {  year: 'numeric', month: 'long', day: 'numeric' };
    return newDate.toLocaleDateString('en-in', options);
};

const createWorkshopDetailsList = (workshopDetails) => {
    const data = {
        ['Begin Date']: formatDate(workshopDetails.begin_date) ?? 'N/A',
        ['End Date']: formatDate(workshopDetails.end_date) ?? 'N/A',
        ['Mode']: workshopDetails.mode ?? 'N/A',
        ['Participant Intake']: workshopDetails.participant_intake ?? 'N/A',
        ['Specialization Area']: workshopDetails.area_specialization ?? 'N/A'
    };

    return Object.entries(data).map(([key, value]) => `${key}: ${value}`);
};

const createCoordinatorDetailsList = (coordinatorDetails, instituteDetails) => {
    const data = {
        ['Coordinator Name']: coordinatorDetails.title ? `${coordinatorDetails.title} ${coordinatorDetails.first_name} ${coordinatorDetails.last_name}` : 'N/A',
        ['Email Id']: coordinatorDetails.email_id ?? 'N/A',
        ['Institute Name']: instituteDetails.institute_name ?? 'N/A',
        ['Institute Address']: `${instituteDetails.institute_address}, ${instituteDetails.district_name ?? ""}, ${instituteDetails.state_name ?? ""}`
    };

    return Object.entries(data).map(([key, value]) => `${key}: ${value}`);
};

const createResourcePersonsList = (personDetails) => {
    const data = {
        ['Designation']: personDetails.designation ?? 'N/A',
        ['Specialization']: personDetails.specialization ?? 'N/A',
        ['Email Id']: personDetails.email_id ?? 'N/A',
        ['Organization Name']: personDetails.organization_name ?? 'N/A'
    };

    const nestedList = Object.entries(data).map(([key, value]) => `${key}: ${value}`);
    return [personDetails.person_name ?? 'N/A', nestedList];
};


exports.createWorkshopBrochureHandler = ( 
    { 
        workshopImagesUrls = [],
        resourcePersonsDetails = [], 
        workshopDetails = {},
        coordinatorDetails = {},
        instituteDetails = {}
    },
    callback) => {
    //creating the path for the new file brochure
    let index = __dirname.lastIndexOf(`\\`);
    let rootDir = __dirname.slice(0, index - __dirname.length);
    let dir = path.join(rootDir + '/files/workshop-docs/brochure');
    const fileName = uniqueFilename(dir, 'brochure-' + workshopDetails.workshop_id ?? Math.random() * 10000) + '.pdf';

    const doc = new PDFDocument({displayTitle: true, font: 'Helvetica'});
    doc.info.Title = 'FDP Workshop Brochure';
    const writeStream = fs.createWriteStream(fileName);
    doc.pipe(writeStream);
    
    try {
    
        //writing the title of workshop 
        doc
            .fontSize(18)
            .font('Helvetica-Bold')
            .text(workshopDetails.title, { align: 'center'});
    
        doc
            .moveDown(2)
            .fontSize(12)
            .text('Workshop Details:-');
    
        doc
            .moveDown(1)
            .fontSize(10)
            .font('Helvetica')
            .list(createWorkshopDetailsList(workshopDetails))
            .list(createCoordinatorDetailsList(coordinatorDetails, instituteDetails))
        
        doc 
            .fillColor('blue')
            .text("View Workshop", { link: `http://localhost:3000/all-workshops/${workshopDetails.workshop_id}`, underline: true });
    
        doc
            .fillColor('black')
            .moveDown(2)
            .font('Helvetica-Bold')
            .fontSize(12)
            .text('Workshop Speakers:-');
        
        resourcePersonsDetails.forEach(personDetails => {
            doc
            .moveDown(1)
            .fontSize(10)
            .font('Helvetica')
            .list(createResourcePersonsList(personDetails))
        });
        
        workshopImagesUrls.forEach((details, index) => {
            if(index%2 === 0){
                doc.addPage();
            }
            doc
                .moveDown(1)
                .image(details.photo_url, {
                    fit: [450, 300],
                    align: 'center'
                })
                .text('', {align: 'center'})
        });
    
        doc.end();
        writeStream.on('finish', () => {
            callback(fileName);
        });
    }
    catch(error) {
        console.log(error);
        doc.end();
        throwError("Something went wrong while creating brochure!", 500);
    }
};