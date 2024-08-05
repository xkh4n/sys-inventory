const countriesController = require("../../controllers/cities");
const express = require("express");
const api = express.Router();

api.post('/getcities', countriesController.getCities);
api.post('/getcitybyidcontry', countriesController.getCityByIdCountry);
api.post('/setcities', countriesController.setCities);
api.post('/setcity', countriesController.setCity);
api.patch('/updatecity', countriesController.updateCity);


module.exports = api;