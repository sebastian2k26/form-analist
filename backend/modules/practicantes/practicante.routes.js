const express = require('express');
const router = express.Router();

const controller = require('./practicante.controller');
const upload = require('../../uploadConfig');
const requireAuth = require('../auth/auth.middleware');


// PRÁCTICANTES ROUTES (RUTAS DEL MÓDULO PRÁCTICANTES)


// CREAR PRÁCTICANTE

// Esta ruta permite registrar un nuevo practicante
// Incluye la subida de archivo (hoja de vida en PDF)
router.post(
    '/',
    upload.single('archivo_cv'),
    controller.registrar
);


// LISTAR PRÁCTICANTES

// Esta ruta devuelve todos los practicantes registrados
// Está protegida, solo usuarios autenticados pueden acceder
router.get(
    '/',
    requireAuth,
    controller.listar
);


// OBTENER UN PRÁCTICANTE

// Esta ruta busca un practicante específico por su ID
// También requiere autenticación
router.get(
    '/:id',
    requireAuth,
    controller.obtenerUno
);


// ACTUALIZAR ESTADO

// Esta ruta permite cambiar el estado de un practicante
// Ej: pendiente, viable o no viable
router.put(
    '/:id/estado',
    requireAuth,
    controller.actualizarEstado
);


// DESCARGAR CV

// Esta ruta permite descargar la hoja de vida del practicante
router.get(
    '/:id/cv',
    requireAuth,
    controller.descargarCV
);


// EXPORTACIÓN

// Se exporta el router para usarlo en el servidor principal
module.exports = router;