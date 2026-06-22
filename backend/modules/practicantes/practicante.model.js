const db = require('../../config/db');


// EJECUCIÓN DE CONSULTAS (HELPERS)

// Esta función ejecuta consultas tipo INSERT, UPDATE o DELETE
// y permite trabajar con promesas para usar async/await
const runQuery = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) reject(err);
            else resolve(this); // devuelve información de la ejecución (como lastID)
        });
    });
};


// Esta función ejecuta consultas que devuelven una sola fila
const getQuery = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) reject(err);
            else resolve(row); // devuelve un solo registro
        });
    });
};


// Esta función ejecuta consultas que devuelven varias filas
const allQuery = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows); // devuelve una lista de registros
        });
    });
};


// CREAR PRÁCTICANTE

// Inserta un nuevo practicante en la base de datos
const crear = async (data) => {

    const sql = `
        INSERT INTO practicantes 
        (nombre_completo, correo, carrera, semestre, archivo_cv, estado)
        VALUES (?, ?, ?, ?, ?, 'pendiente')
    `;

    const result = await runQuery(sql, [
        data.nombre_completo,
        data.correo,
        data.carrera,
        data.semestre,
        data.archivo_cv
    ]);

    // Se retorna el ID del nuevo registro creado
    return { id: result.lastID };
};


// OBTENER TODOS LOS PRÁCTICANTES

// Devuelve la lista completa de practicantes ordenados por fecha
const obtenerTodos = async () => {
    return await allQuery(`SELECT * FROM practicantes ORDER BY fecha_registro DESC`);
};


// OBTENER PRÁCTICANTE POR ID

// Busca un practicante específico usando su ID
const obtenerPorId = async (id) => {
    return await getQuery(`SELECT * FROM practicantes WHERE id = ?`, [id]);
};


// ACTUALIZAR ESTADO

// Cambia el estado de un practicante (pendiente, viable, no viable)
const actualizarEstado = async (id, estado) => {

    const result = await runQuery(
        `UPDATE practicantes SET estado = ? WHERE id = ?`,
        [estado, id]
    );

    // Retorna true si se actualizó al menos un registro
    return result.changes > 0;
};


// OBTENER CV

// Obtiene el archivo de hoja de vida y el nombre del practicante
const obtenerCV = async (id) => {
    return await getQuery(
        `SELECT archivo_cv, nombre_completo FROM practicantes WHERE id = ?`,
        [id]
    );
};


// EXPORTACIÓN

// Se exportan todas las funciones del modelo para usarlas en el controlador
module.exports = {
    crear,
    obtenerTodos,
    obtenerPorId,
    actualizarEstado,
    obtenerCV
};