// Importamos las librerías necesarias
const multer = require('multer'); // Librería para manejar subida de archivos
const path = require('path');     // Manejo de rutas del sistema
const fs = require('fs');         // Manejo del sistema de archivos (crear carpetas, etc.)


// Definimos la carpeta donde se guardarán los archivos subidos
const UPLOAD_DIR = path.join(__dirname, 'uploads');


// Nos aseguramos de que la carpeta "uploads" exista al iniciar el servidor
// Si no existe, la crea automáticamente
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}


// CONFIGURACIÓN DE ALMACENAMIENTO

// "storage" le indica a Multer:
// - dónde guardar los archivos
// - con qué nombre guardarlos
const storage = multer.diskStorage({

  // Definimos la carpeta destino
  destination: function (req, file, cb) {
    // cb = callback (error, ruta)
    // null significa que no hay error
    cb(null, UPLOAD_DIR);
  },

  // Definimos el nombre del archivo
  filename: function (req, file, cb) {

    // Usamos timestamp para evitar nombres duplicados
    const timestamp = Date.now();

    // Limpiamos el nombre original del archivo
    const nombreLimpio = file.originalname
      .normalize('NFD') // separa letras de tildes
      .replace(/[\u0300-\u036f]/g, '') // elimina tildes
      .replace(/[^a-zA-Z0-9.\-_]/g, '_'); // reemplaza espacios y símbolos raros

    // Ejemplo final: 1750000000000-hoja_de_vida.pdf
    cb(null, `${timestamp}-${nombreLimpio}`);
  }
});


// FILTRO DE ARCHIVOS

// Esta función valida qué tipo de archivo se permite subir
function fileFilter(req, file, cb) {

  // Solo permitimos archivos PDF
  if (file.mimetype === 'application/pdf') {
    cb(null, true); // se acepta el archivo
  } else {
    // Se rechaza el archivo con un mensaje claro
    cb(new Error('Solo se permiten archivos PDF para la hoja de vida.'), false);
  }
}


// CONFIGURACIÓN FINAL DE MULTER

const upload = multer({

  storage: storage,     // dónde y cómo guardar archivos
  fileFilter: fileFilter, // validación de tipo de archivo

  // Límites de seguridad
  limits: {
    fileSize: 5 * 1024 * 1024 // tamaño máximo: 5 MB
  }
});


// Exportamos la configuración para usarla en las rutas
// Ejemplo: upload.single('archivo_cv')
module.exports = upload;