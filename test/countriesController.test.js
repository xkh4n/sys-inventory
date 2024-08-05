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
            expect(response.body.dataMessage).toEqual(mockCountries);
        });

        it('hould return 404 countries is empty', async () => {
            const mockCountries = [];
            Country.find.mockResolvedValue(mockCountries);
            const response = await request(app).post('/api/1.0/countries/getcountries');
            expect(response.status).toBe(404);
            expect(response.body.dataMessage).toEqual('No countries found');
        });
        it('should handle server errors', async () => {
            Country.find.mockRejectedValue(new Error('Server error'));

            const response = await request(app).post('/api/1.0/countries/getcountries');

            expect(response.status).toBe(500);
            expect(response.body.dataMessage).toEqual('Server error');
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


    describe('setCountryOne', () => {
        test('should return status code 201 and a json object', async () => {
            const mockCountry = {
                iso_code: "CL",
                iata_code: "CHL",
                name_country: "CHILE"
            };
            Country.create.mockResolvedValue(mockCountry);

            const response = await request(app).post('/api/1.0/countries/setcountry').send(mockCountry);
            expect(response.status).toBe(201);
            expect(response.body.code).toEqual('Ok')
        });
    });

    describe('setCountryMany', () => {
        it('should return a 201 code and a json object', async () => {
            const mockCountry = [
                { iso_code: "CL", iata_code: "CHL", name_country: "CHILE" },
                { iso_code: "AF", iata_code: "AFG", name_country: "AFGANISTAN" },
                { iso_code: "AL", iata_code: "ALB", name_country: "ALBANIA" }
            ];

            Country.prototype.save = jest.fn().mockResolvedValueOnce(mockCountry[0])
                                              .mockResolvedValueOnce(mockCountry[1])
                                              .mockResolvedValueOnce(mockCountry[2]);

            const response = await request(app).post('/api/1.0/countries/setcountries').send(mockCountry);

            expect(response.status).toBe(201);
            expect(response.body.dataMessage).toEqual(mockCountry);
        });
    });

describe('updateCountry', () => {
    it('should update a country and return the updated country', async () => {
        const mockUpdatedCountry = { iso_code: 'US', iata_code: 'USA', name_country: 'United States of America' };
        Country.findOneAndUpdate.mockResolvedValue(mockUpdatedCountry);

        const response = await request(app).patch('/api/1.0/countries/updatecountry').send({
            iata_code: 'USA',
            updateData: { name_country: 'United States of America' }
        });

        expect(response.status).toBe(202);
        expect(response.body).toEqual(mockUpdatedCountry);
    });

    it('should return 400 if IATA code or update data is missing', async () => {
        const response = await request(app).patch('/api/1.0/countries/updatecountry').send({
            updateData: { name_country: 'United States of America' }
        });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: 'IATA code and update data are required' });
    });

    it('should return 404 if country not found', async () => {
        Country.findOneAndUpdate.mockResolvedValue(null);

        const response = await request(app).patch('/api/1.0/countries/updatecountry').send({
            iata_code: 'XYZ',
            updateData: { name_country: 'Unknown Country' }
        });

        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: 'Country not found' });
    });

    it('should handle server errors', async () => {
        Country.findOneAndUpdate.mockRejectedValue(new Error('Server error'));

        const response = await request(app).patch('/api/1.0/countries/updatecountry').send({
            iata_code: 'USA',
            updateData: { name_country: 'United States of America' }
        });

        expect(response.status).toBe(500);
        expect(response.body.dataMessage).toEqual('Server error');
    });
});

});
