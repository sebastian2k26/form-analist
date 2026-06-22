
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, '../data/practicantes.db');

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Error al conectar con la base de datos:', err.message);
  } else {
    console.log('Conectado a la base de datos SQLite en', DB_PATH);
  }
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS practicantes (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre_completo TEXT    NOT NULL,
      correo          TEXT    NOT NULL,
      carrera         TEXT    NOT NULL,
      semestre        TEXT    NOT NULL,
      archivo_cv      TEXT,                 -- nombre del archivo guardado en /uploads
      estado          TEXT    NOT NULL DEFAULT 'pendiente', 
      fecha_registro  DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Error al crear la tabla practicantes:', err.message);
    } else {
      console.log('Tabla "practicantes" lista para usar.');
    }
  });
});

// Exportamos la conexión "db" para usarla en otros archivos (rutas de la API).
module.exports = db;
