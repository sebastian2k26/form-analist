// Cargamos las variables de entorno desde el archivo .env
// Esto permite usar valores como el puerto o claves sin escribirlas directamente en el código
require('dotenv').config();

// Importamos las librerías necesarias para el funcionamiento del servidor
const express = require('express'); // Framework principal para crear el servidor
const cors = require('cors'); // Permite que el frontend se comunique con el backend
const session = require('express-session'); // Manejo de sesiones (login)
const path = require('path'); // Manejo de rutas del sistema (archivos, carpetas)


// Importamos la configuración de la base de datos
// Solo con requerir este archivo ya se ejecuta la conexión
require('./config/db');


// Importamos las rutas del sistema
// Cada módulo tiene sus propias rutas separadas
const practicantesRoutes = require('./modules/practicantes/practicante.routes');
const authRoutes = require('./modules/auth/auth.routes');


// Creamos la aplicación de express
const app = express();

// Definimos el puerto donde correrá el servidor
// Si existe una variable de entorno PORT la usa, si no usa el 3000 por defecto
const PORT = process.env.PORT || 3000;



// CONFIGURACIONES GLOBALES

// Configuración de CORS
// Permite que el frontend (aunque esté en otro puerto o dominio) pueda hacer peticiones
app.use(cors({
  origin: true,        // Permite cualquier origen
  credentials: true    // Permite el envío de cookies (importante para sesiones)
}));


// Permite que el servidor entienda datos en formato JSON
// Ej: cuando enviamos datos desde fetch o axios
app.use(express.json());

// Permite leer datos enviados desde formularios HTML
// extended: true permite estructuras más complejas
app.use(express.urlencoded({ extended: true }));


// CONFIGURACIÓN DE SESIONES

app.use(session({
  // Clave secreta para firmar la sesión
  // Se recomienda tenerla en .env por seguridad
  secret: process.env.SESSION_SECRET || 'clave-secreta',

  // Evita guardar la sesión si no ha habido cambios
  resave: false,

  // Evita crear sesiones vacías
  saveUninitialized: false,

  // Configuración de la cookie de sesión
  cookie: {
    httpOnly: true, // La cookie no es accesible desde JavaScript (más seguro)
    maxAge: 1000 * 60 * 60 * 4 // Duración: 4 horas
  }
}));



// ARCHIVOS ESTÁTICOS

// Permite servir archivos estáticos como HTML, CSS y JS
// Todo lo que esté en la carpeta "public" podrá abrirse desde el navegador
app.use(express.static(path.join(__dirname, 'public')));



// RUTAS PRINCIPALES

// Todas las rutas de autenticación comenzarán con /api/auth
// Ej: /api/auth/login
app.use('/api/auth', authRoutes);

// Todas las rutas de practicantes comenzarán con /api/practicantes
// Ej: /api/practicantes
app.use('/api/practicantes', practicantesRoutes);



// RUTA DE PRUEBA (HEALTH CHECK)

// Esta ruta sirve para verificar que el servidor está funcionando
app.get('/api/health', (req, res) => {
  res.json({ estado: 'ok' });
});



// MANEJO GLOBAL DE ERRORES

// Este middleware captura errores que ocurran en cualquier parte de la app
app.use((err, req, res, next) => {
  console.error('Error:', err.message); // Se muestra el error en consola

  res.status(400).json({
    error: err.message || 'Error inesperado'
  });
});



// INICIO DEL SERVIDOR

// Se levanta el servidor en el puerto definido
app.listen(PORT, () => {
  console.log(`\nServidor en http://localhost:${PORT}`);
});