const countriesController = require("../../controllers/countries");
const express = require("express");
const api = express.Router();

api.post('/getcountries', countriesController.getCountryAll);
api.post('/getcountry', countriesController.getCountryOne);
api.post('/setcountries', countriesController.setCountryOne);
api.post('/setcountry', countriesController.setCountryOne);
api.post('/updatecountry', countriesController.updateCountry);


module.exports = api;