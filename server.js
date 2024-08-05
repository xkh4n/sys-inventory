/* ENVIRONMENT */
const dotenv = require("dotenv").config();

/* LOGS */
const log4 = require("log4js");
const logger = log4.getLogger("index.js");
logger.level = "all";


/* SERVER */
const express = require("express");


/* APP */
const app = express()


/* PARSER */
const parser = require("body-parser");



/* CORS */
const cors = require("cors");



/* ROUTES */
const { countries, cities } = require("./src/routes");


/* PARSER CONFIG */
app.use(parser.urlencoded({ extended: false }));
app.use(parser.json());


/* CORS CONFIG */
app.use(cors());


/* ROUTES CONFIG */
const base_path = '/api/' + process.env.API_VERSION;
app.use(base_path + '/countries', countries);
app.use(base_path + '/cities', cities);


/* STATICS FOLDERS */
app.use(express.static("uploads"));
app.use(express.static("uploads/avatars"));
app.use(express.static("uploads/files"));



/*  */

module.exports = app;