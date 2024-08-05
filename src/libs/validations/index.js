/* ENVIRONMENT */
const dotenv = require("dotenv").config();

/* LOGS */
const log4 = require("log4js");
const logger = log4.getLogger("validations.js");
logger.level = "all";

const validateCountryIsoCode = (iso_code) => {
    const regEx = /^[A-Z]{2}$/;
    return regEx.test(iso_code);
}

const validateCountryIataCode = (iata_code) => {
    const regEx = /^[A-Z]{3}$/;
    return regEx.test(iata_code);
}

const validateCountryName = (name_pais) => {
    const regEx = /^[A-Z -]{3,50}$/;
    logger.info(name_pais);
    return regEx.test(name_pais);
}

const validateCodeTerritorial = (code_territorial) => {
    const regEx = /^[A-Z0-9]{3,5}$/;
    return regEx.test(code_territorial);
}

const validatePermission = (view_perm) => {
    const regEx = /^[0-9]{2}$/;
    return regEx.test(view_perm);
}

const validateCodePostal = (code_postal) => {
    const regEx = /^[0-9]{3,7}$/;
    return regEx.test(code_postal);
}

const validateCodeTributario = (code_sii) => {
    const regEx = /^[0-9]{3,5}$/;
    return regEx.test(code_sii);
}

const validateCodeCargo = (cod_cargo) => {
    // Expresión regular para validar dígitos de 3 a 12 caracteres
    const regEx = /^\d{8,12}$/;
    if (!regEx.test(cod_cargo)) {
        return false;
    }
    const numero = parseInt(cod_cargo, 10);
    return numero >= 1000100000 && numero <= 999999999999;
}
const validateRut = (rut) => {
    const regEx = /^[0-9kK.-]{9,12}$/i;
    return regEx.test(rut);
}

const validateName = (nombre) => {
    const regEx = /^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ ]+$/;
    return regEx.test(nombre);
}

const validateUserName = (username) => {
    const regEx = /^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ]{4,20}$/;
    return regEx.test(username);
}

const validatePassword = (pass) => {
    const regEx = /^(?!.*\b(SCRIPT|script|AND|and|OR|or)\b)[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ0-9*.,;{}$#&!?¿¡ºª-]{8,20}$/;
    return regEx.test(pass);
};


const validateParagraph = (texto) => {
    // TODO: Validar que el parrafo no sea vacío y tenga entre 1 y 65535 caracter
    const regEx = /^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ0-9#.,()"ºª _\-¿¡!&%;:/]+$/;
    return regEx.test(texto);
}

const validateURL = (url) => {
    const regEx = /^(https?:\/\/)?([\w-]+\.+[\w-]+)+([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/;
    return regEx.test(url);
}

const validatePhone = (phone) => {
    const regEx = /^\s*(?:\+?(\d{1,3}))?([-. (]*(\d{3})[-. )]*)?((\d{1,4})[-. ]*(\d+))?\s*$/gm;
    return regEx.test(phone);
}

const validateEmail = (mail) => {
    const regEx = /\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/gi
    return regEx.test(mail);
}

const validateDate = (fecha) => {
    const regEx = /^(0[1-9]|[1-2][0-9]|3[0-1])[\/\-](0[1-9]|1[0-2])[\/\-]\d{4}$/;
    return regEx.test(fecha);
};

const validateView = (fecha) => {
    const regEx = /^[a-zA-Z0-9_\/-]+$/;
    return regEx.test(fecha);
};

const validateLink = (link) => {
    const regEx = /^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ_-]+$/;
    return regEx.test(link);
}

const validateID = (ID) => {
    const regEx = /^[0-9a-fA-F]{24}$/;
    return regEx.test(ID);
}

module.exports = {
    validateCountryIsoCode,
    validateCountryIataCode,
    validateCountryName,
    validateCodeTerritorial,
    validateCodePostal,
    validateCodeTributario,
    validateRut,
    validateParagraph,
    validateURL,
    validatePhone,
    validatePermission,
    validateName,
    validateEmail,
    validateDate,
    validatePassword,
    validateUserName,
    validateView,
    validateLink,
    validateID,
    validateCodeCargo,
}