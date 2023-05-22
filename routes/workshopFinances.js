const express = require("express");

const { updateWorkshopFinance, getWorkshopFinanceDetails } = require("../controllers/workshopFinances");

const routes = express.Router();

routes.post("/update-finance-details", updateWorkshopFinance);

routes.get("/report", getWorkshopFinanceDetails);

module.exports = routes;