/* ENVIRONMENT */
const dotenv = require("dotenv").config();

/* LOGS */
const log4 = require("log4js");
const logger = log4.getLogger("citiesController.js");
logger.level = "all";

/* BDD */
const mongo = require("mongoose");


/* MODEL */
const Countries = require("../../models/modelCountries");
const Cities = require("../../models/citiesModel");

/* VALIDATIONS */
const validaPais = require("../../libs/validations");

/* CUSTOM ERRORS */
const errors = require("../../libs/errors");

const setCity = async (req, res) => {
    try {
        const { iso_code, name_city, country } = req.body;
        const _country = await Countries.findOne({ iata_code: country });
        if (!_country) {
            throw new errors(406, 'País no encontrado');
        }
        
        const city = new Cities({
            iso_code: iso_code,
            name_city: name_city,
            country: _country._id
        });
        const ciudad = await city.save();
        const response = {
            "code": 'Ok',
            "dataMessage": ciudad
        }
        res.status(201).json(response);
    } catch (error) {
        if (error instanceof errors) {
            res.status(error.code).send(error.getMessage());
        } else {
            const response = {
                "code": 500,
                "dataMessage": error.message
            }
            res.status(500).json(response);
        }
    }
}

const setCities = async (req, res) => {
    try {
        const cant = Object.keys(req.body).length;
        const promises = [];
        for (let i = 0; i < cant; i++) {
            const { iso_code, name_city, country } = req.body[i];
            const _country = await Countries.findOne({ iata_code: country });
            if (!_country) {
                throw new errors(406, 'País no encontrado');
            }
            
            const city = new Cities({
                iso_code: iso_code,
                name_city: name_city,
                country: _country._id
            });
            promises.push(
                city.save()
                    .then()
                    .catch(() => {
                        const response = {
                            "code": 428,
                            "dataMessage": "Failed in wanting to save the country"
                        };
                        throw new errors(428, response);
                    })
            );
        }
        const newCity = await Promise.all(promises);
        const response = {
            "code": 'Ok',
            "dataMessage": newCity
        }
        res.status(201).json(response);
    } catch (error) {
        if (error instanceof errors) {
            res.status(error.code).send(error.getMessage());
        } else {
            const response = {
                "code": 500,
                "dataMessage": error.message
            }
            res.status(500).json(response);
        }
    }
}

const getCityByIdCountry = async (req, res) => {
    try {
        const { country } = req.body;
        const idCountry = new mongo.Types.ObjectId(country);
        if (!validaPais.validateID(country)) {
            throw new errors(404, 'País no existe en BDD');
        }
        const cities = await Cities.find({ country: country })
        if (!cities || cities.length == 0) {
            throw new errors(404, 'No existen ciudades para éste País');
        }
        const response = {
            "code": 'Ok',
            "dataMessage": cities
        }
        res.status(201).json(response);
    } catch (error) {
        if (error instanceof errors) {
            const response = {
                "code": error.code,
                "dataMessage": error.getMessage()
            }
            res.status(error.code).send(response);
        } else {
            const response = {
                "code": 500,
                "dataMessage": error.message
            }
            res.status(500).json(response);
        }
    }
}

const getCities = async (req, res) => {
    try {

        const response = {
            "code": 'Ok',
            "dataMessage": ''
        }
        res.status(201).json(response);
    } catch (error) {
        if (error instanceof errors) {

            res.status(error.code).send(error.message);
        } else {
            const response = {
                "code": 500,
                "dataMessage": error.message
            }
            res.status(500).json(response);
        }
    }
}

const updateCity = async (req, res) => {
    try {

        const response = {
            "code": 'Ok',
            "dataMessage": ''
        }
        res.status(201).json(response);
    } catch (error) {
        if (error instanceof errors) {
            res.status(error.code).send(error.getMessage());
        } else {
            const response = {
                "code": 500,
                "dataMessage": error.message
            }
            res.status(500).json(response);
        }
    }
}

module.exports = {
    setCity,
    setCities,
    getCityByIdCountry,
    getCities,
    updateCity
}