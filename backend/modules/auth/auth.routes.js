// RUTAS DE AUTENTICACIÓN

// Se importa Express para poder crear las rutas del sistema
const express = require('express');

// Se crea un router para manejar las rutas relacionadas con autenticación
const router = express.Router();

// Se importa el controlador donde está la lógica de login, logout y estado
const controller = require('./auth.controller');


// LOGIN

// Ruta que recibe las credenciales del usuario
// Se ejecuta cuando el usuario intenta iniciar sesión
router.post('/login', controller.login);


// LOGOUT

// Ruta que cierra la sesión del usuario activo
router.post('/logout', controller.logout);


// ESTADO DE SESIÓN

// Ruta que permite consultar si el usuario está autenticado o no
router.get('/estado', controller.estado);


// EXPORTACIÓN

// Se exporta el router para poder usarlo en el archivo principal del servidor
module.exports = router;