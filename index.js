/* ENVIRONMENT */
const dotenv = require("dotenv").config();

/* LOGS */
const log4 = require("log4js");
const logger = log4.getLogger("index.js");
logger.level = "all";

/* BDD */
const mongo = require("mongoose");
mongo.set('strictQuery', false);

/* SERVER */
const app = require("./server");
var SERVER = '';


/* PORT */
var PORT = undefined; 

/* URL */
var URI = `mongodb+srv://${process.env.NODE_ENV}${process.env.DB_USER}:${process.env.NODE_ENV}${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.NODE_ENV}${process.env.DB_NAME}`;

/* VALIDATE THE AMBIENT RUNNING */
switch (process.env.NODE_ENV) {
  case 'prd_':
    PORT = 3030;
    SERVER = 'PRODUCTION';
    break;
  case 'dev_':
    PORT = 3040;
    SERVER = 'DEVELOPMENT';
    break;
  case 'tst_':
    PORT = 3050;
    SERVER = 'TESTING';
    break;
}


(async () => {
  try {
    await mongo.connect(URI);
    logger.info(`Connection to ${SERVER} it's Ok`);
    await app.listen(PORT, () => {
      logger.debug(`Server of ${SERVER} is Running in: http://${process.env.API_HOST}:${PORT}/api/${process.env.API_VERSION}/`);
    });
  } catch (error) {
    logger.error("Connection to BDD is Fail: ", error);
  }
})();