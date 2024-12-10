/* LOGS */
const log4 = require("log4js");
const logger = log4.getLogger("citiesController.test.js");
logger.level = "all";

const request = require('supertest');
const app = require('../server'); // Asegúrate de que la ruta sea correcta
const Country = require('../src/models/modelCountries');
const City = require('../src/models/citiesModel');

// Mock de mongoose model
jest.mock('../src/models/modelCountries');
jest.mock('../src/models/citiesModel.js');

describe('Cities Controller Test', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('New City', () => {
        it('should return status code 201 and a json object', async () => {
            const mockCountry = {
                _id: '60c72b2f4f1a4e1a5c8e5c44',
                iso_code: "CHL",
                name_country: "Chile"
            };
            const mockCity = {
                _id: '66b11a324553ddc98e1fb544',
                iso_code: "SCL",
                name_city: "Santiago",
                country: mockCountry._id
            };
            Country.findOne.mockResolvedValue(mockCountry);
            City.prototype.save = jest.fn().mockResolvedValue(mockCity);

            const response = await request(app).post('/api/1.0/cities/setcity').send({
                iso_code: "SCL",
                name_city: "Santiago",
                country: "CHL"
            });

            expect(response.status).toBe(201);
            expect(response.body.code).toEqual('Ok');

            expect(response.body.dataMessage).toEqual(expect.objectContaining({
                iso_code: "SCL",
                name_city: "Santiago",
                country: "60c72b2f4f1a4e1a5c8e5c44"
            }));
        });

        it('should return 406 if country is not found', async () => {
            Country.findOne.mockResolvedValue(null);

            const response = await request(app).post('/api/1.0/cities/setcity').send({
                iso_code: "SCL",
                name_city: "Santiago",
                country: "XYZ"
            });

            expect(response.status).toBe(406);
            expect(response.text).toBe('País no encontrado');
        });

        it('should handle server errors', async () => {
            Country.findOne.mockRejectedValue(new Error('Server error'));

            const response = await request(app).post('/api/1.0/cities/setcity').send({
                iso_code: "SCL",
                name_city: "Santiago",
                country: "CHL"
            });

            expect(response.status).toBe(500);
            expect(response.body.dataMessage).toBe('Server error');
        });
    });

    describe('New Cities', () => {
        it('should return a json object with all cities', async () => {
            const mockCountry = [
                {
                _id: '66aede2e4298e6ed10e85a9b',
                iso_code: "CHL",
                name_country: "Chile"
                },
                {
                _id: '66aede2e4298e6ed10e85aff',
                iso_code: "LBN",
                name_country: "Libano"
                }
            ];
            const mockCity =[
                {
                    "iso_code": "ANF",
                    "name_city": "ANTOFAGASTA",
                    "country": "66aede2e4298e6ed10e85a9b",
                    "_id": "66b132b550d4491c9390d2d6",
                    "__v": 0
                },
                {
                    "iso_code": "BBA",
                    "name_city": "AYSEN DEL GENERAL CARLOS IBANEZ DEL CAMPO",
                    "country": "66aede2e4298e6ed10e85a9b",
                    "_id": "66b132b550d4491c9390d2d9",
                    "__v": 0
                },
                {
                    "iso_code": "BEY",
                    "name_city": "BEIRUT",
                    "country": "66aede2e4298e6ed10e85aff",
                    "_id": "66b132b650d4491c9390d2dc",
                    "__v": 0
                }
            ]
            Country.findOne.mockResolvedValue(mockCountry);
            City.prototype.save = jest.fn().mockResolvedValue(mockCity);

            const response = await request(app).post('/api/1.0/cities/setcity').send([
                {
                    iso_code: "ANF",
                    name_city: "ANTOFAGASTA",
                    country: "CHL"
                },
                {
                    iso_code: "BBA",
                    name_city: "AYSEN DEL GENERAL CARLOS IBANEZ DEL CAMPO",
                    country: "CHL"
                },
                {
                    iso_code: "BEY",
                    name_city: "BEIRUT",
                    country: "LBN"
                },
            ]);
            expect(response.status).toBe(201);
            expect(response.body.code).toEqual('Ok');
            expect(response.body.dataMessage[0].country).toBe('66aede2e4298e6ed10e85a9b')
        });
    });

    describe('should return city by country', () => {
        it('getCityByCountryId', async () => {
            const mockCountry = [
                { _id: '66aede2e4298e6ed10e85a9b', iso_code: "CHL", name_country: "Chile" },
                { _id: '66aede2e4298e6ed10e85aff', iso_code: "LBN", name_country: "Libano" },
                { _id: '66aede2e4298e6ed10e85aa4', iso_code: "ARG", name_country: "Argentina" }
            ];
            const mockCity =[
                { iso_code: "ANF", name_city: "ANTOFAGASTA", country: "66aede2e4298e6ed10e85a9b", _id: "66b132b550d4491c9390d2d6", __v: 0 },
                { iso_code: "BBA", name_city: "AYSEN DEL GENERAL CARLOS IBANEZ DEL CAMPO", country: "66aede2e4298e6ed10e85a9b", _id: "66b132b550d4491c9390d2d9", __v: 0 },
                { iso_code: "BEY", name_city: "BEIRUT", country: "66aede2e4298e6ed10e85aff", _id: "66b132b650d4491c9390d2dc", __v: 0 },
                { iso_code: "BHI", name_city: "BAHIA BLANCA", country: "66aede2e4298e6ed10e85aa4", _id: "66b224de124f1da78133057b", __v: 0 },
                { iso_code: "AEP", name_city: "CIUDAD DE BUENOS AIRES", country: "66aede2e4298e6ed10e85aa4", _id: "66b224de124f1da78133057e", __v: 0 },
                { iso_code: "EZE", name_city: "EZEIZA", country: "66aede2e4298e6ed10e85aa4", _id: "66b224de124f1da781330581", __v: 0 },
                { iso_code: "LPG", name_city: "LA PLATA", country: "66aede2e4298e6ed10e85aa4", _id: "66b224df124f1da781330584", __v: 0 },
                { iso_code: "MDZ", name_city: "MENDOZA", country: "66aede2e4298e6ed10e85aa4", _id: "66b224e1124f1da781330587", __v: 0 }
            ]
            Country.findOne.mockResolvedValue(mockCountry);
            City.prototype.save = jest.fn().mockResolvedValue(mockCity);

            const response = await request(app).post('/api/1.0/cities/getcitybyidcontry').send([
                { _id: '66aede2e4298e6ed10e85a9b', iso_code: "CHL", name_country: "Chile" }
            ]);
            expect(response.status).toBe(204);
            expect(response.body.dataMessage[0].country).toBe('66aede2e4298e6ed10e85a9b')
        });
    });
});
