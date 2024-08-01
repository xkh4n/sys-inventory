// src/controllers/countries/index.js

/* ENVIRONMENT */
const dotenv = require("dotenv").config();

/* LOGS */
const log4 = require("log4js");
const logger = log4.getLogger("countriesController.js");
logger.level = "all";

/* MODEL */
const Country = require("../../models/modelCountries");

/* VALIDATIONS */
//const validaPais = require("../../libs/validations");

const getCountryAll = async (req, res) => {
    try {
        const countries = await Country.find();
        res.status(200).json(countries);
    } catch (error) {
        logger.error("Error fetching all countries:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

const getCountryOne = async (req, res) => {
    const { iata_code } = req.body;
    if (!iata_code) {
        return res.status(400).json({ message: "IATA code is required" });
    }
    try {
        const country = await Country.findOne({ iata_code });
        if (!country) {
            return res.status(404).json({ message: "Country not found" });
        }
        res.status(200).json(country);
    } catch (error) {
        logger.error("Error fetching country:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

const setCountryOne = async (req, res) => {
    const { iso_code, iata_code, name_country } = req.body;
    if (!iso_code || !iata_code || !name_country) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        const newCountry = new Country({ iso_code, iata_code, name_country });
        await newCountry.save();
        const response = {
            "message": "Ok",
            "data":[newCountry]
        };
        res.status(201).json(response);
    } catch (error) {
        logger.error("Error saving country:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

const setCountryMany = async (req, res) => {
    const countries = req.body;
    if (!Array.isArray(countries) || countries.length === 0) {
        return res.status(400).json({ message: "A non-empty array of countries is required" });
    }
    try {
        const newCountries = await Country.insertMany(countries);
        res.status(201).json(newCountries);
    } catch (error) {
        logger.error("Error saving countries:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

const updateCountry = async (req, res) => {
    const { iata_code, updateData } = req.body;
    if (!iata_code || !updateData) {
        return res.status(400).json({ message: "IATA code and update data are required" });
    }
    try {
        const updatedCountry = await Country.findOneAndUpdate(
            { iata_code },
            updateData,
            { new: true }
        );
        if (!updatedCountry) {
            return res.status(404).json({ message: "Country not found" });
        }
        res.status(200).json(updatedCountry);
    } catch (error) {
        logger.error("Error updating country:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {
    getCountryAll,
    getCountryOne,
    setCountryOne,
    setCountryMany,
    updateCountry,
};
