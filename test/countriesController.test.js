/* LOGS */
const log4 = require("log4js");
const logger = log4.getLogger("countriesController.test.js");
logger.level = "all";


const request = require('supertest');
const app = require('../server'); // Asegúrate de que la ruta sea correcta
const Country = require('../src/models/modelCountries');

// Mock de mongoose model
jest.mock('../src/models/modelCountries');

describe('Countries Controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getCountryAll', () => {
        it('should return all countries', async () => {
            const mockCountries = [{ iso_code: 'US', iata_code: 'USA', name_country: 'United States' }];
            Country.find.mockResolvedValue(mockCountries);

            const response = await request(app).post('/api/1.0/countries/getcountries');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockCountries);
        });

        it('should handle server errors', async () => {
            Country.find.mockRejectedValue(new Error('Server error'));

            const response = await request(app).post('/api/1.0/countries/getcountries');

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ message: 'Internal server error' });
        });
    });

    describe('getCountryOne', () => {
        test('should return a single country by IATA code', async () => {
            const mockCountry = { iso_code: 'US', iata_code: 'USA', name_country: 'United States' };
            Country.findOne.mockResolvedValue(mockCountry);

            const response = await request(app).post('/api/1.0/countries/getcountry').send({ iata_code: 'USA' });

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockCountry);
        });

        it('should return 400 if IATA code is missing', async () => {
            const response = await request(app).post('/api/1.0/countries/getcountry');

            expect(response.status).toBe(400);
            expect(response.body).toEqual({ message: 'IATA code is required' });
        });

        it('should return 404 if country not found', async () => {
            Country.findOne.mockResolvedValue(null);

            const response = await request(app).post('/api/1.0/countries/getcountry').send({ iata_code: 'XYZ' });

            expect(response.status).toBe(404);
            expect(response.body).toEqual({ message: 'Country not found' });
        });

        it('should handle server errors', async () => {
            Country.findOne.mockRejectedValue(new Error('Server error'));

            const response = await request(app).post('/api/1.0/countries/getcountry').send({ iata_code: 'USA' });
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ message: 'Internal server error' });
        });
    });

    // Similar tests for setCountryOne, setCountryMany, and updateCountry

    describe('setCountryOne', () => {
        test('should return status code 201 and a json object', async () => {
            const mockCountry = {
                iso_code: "CL",
                iata_code: "CHL",
                name_country: "CHILE"
            };
            Country.create.mockResolvedValue(mockCountry);

            const response = await request(app).post('/api/1.0/countries/setcountry').send(mockCountry);
            /*
            logger.debug(Object.keys(response.body));
            logger.info(response.body.message);
            logger.trace(response.status);
            */
            expect(response.status).toBe(201);
            expect(response.body.message).toEqual('Ok')
        });
    });
});
