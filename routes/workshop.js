const express = require('express');
const createWorkshopRoutes = require('./createWorkshop');
const { authenticateJWT } = require("../middlewares/passport");

const routes = express.Router();

routes.use("/create-workshop", authenticateJWT, createWorkshopRoutes);

module.exports = routes;
