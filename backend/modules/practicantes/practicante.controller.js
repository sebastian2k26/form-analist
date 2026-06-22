const { error } = require('console');
const practicanteModel = require('./practicante.model');
const path = require('path');


// REGISTRAR PRÁCTICANTE

// Esta función recibe los datos del practicante desde el frontend
// y los guarda en la base de datos junto con su hoja de vida
const registrar = async (req, res) => {
    try {

        // Extraemos los datos enviados desde el formulario
        const { nombre_completo, correo, carrera, semestre } = req.body;

        // Validamos que todos los campos obligatorios estén completos
        if (!nombre_completo || !correo || !carrera || !semestre) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
        }

        // Validación básica del correo electrónico
        const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regexCorreo.test(correo)) {
            return res.status(400).json({ error: 'Correo inválido.' });
        }

        // Verificamos si se subió el archivo (hoja de vida)
        const archivo = req.file ? req.file.filename : null;
         
        if (!archivo) {
            return res.status(400).json({ error: 'Debes subir la hoja de vida en PDF.'});
        }

        // Enviamos los datos al modelo para guardarlos en la base de datos
        const resultado = await practicanteModel.crear({
            nombre_completo,
            correo,
            carrera,
            semestre,
            archivo_cv: archivo
        });

        // Respuesta exitosa al crear el registro
        res.status(201).json({
            mensaje: 'Practicante registrado',
            id: resultado.id
        });

    } catch (error) {
        // Manejo de error general del servidor
        res.status(500).json({ error: 'Error interno' });
    }
};


// LISTAR PRÁCTICANTES

// Esta función obtiene todos los practicantes registrados
const listar = async (req, res) => {
    try {

        // Se consultan todos los registros en la base de datos
        const data = await practicanteModel.obtenerTodos();

        // Se envía la lista al frontend
        res.json(data);

    } catch {
        res.status(500).json({ error: 'Error al listar' });
    }
};


// OBTENER UN PRÁCTICANTE POR ID

// Esta función busca un practicante específico usando su ID
const obtenerUno = async (req, res) => {
    try {

        // Se consulta el practicante por su identificador
        const data = await practicanteModel.obtenerPorId(req.params.id);

        // Si no existe el registro, se informa al usuario
        if (!data) {
            return res.status(404).json({ error: 'No encontrado' });
        }

        // Si existe, se envían los datos
        res.json(data);

    } catch {
        res.status(500).json({ error: 'Error interno' });
    }
};


// ACTUALIZAR ESTADO DEL PRÁCTICANTE

// Esta función permite cambiar el estado del practicante
const actualizarEstado = async (req, res) => {
    try {

        // Obtenemos el nuevo estado desde el frontend
        const { estado } = req.body;

        // Lista de estados permitidos
        const estadosValidos = ['viable', 'no_viable', 'pendiente'];

        // Validamos que el estado sea correcto
        if (!estadosValidos.includes(estado)) {
            return res.status(400).json({ error: 'Estado inválido' });
        }

        // Se actualiza el estado en la base de datos
        const actualizado = await practicanteModel.actualizarEstado(req.params.id, estado);

        // Si no se encontró el registro, se informa
        if (!actualizado) {
            return res.status(404).json({ error: 'No encontrado' });
        }

        // Confirmación de actualización
        res.json({ mensaje: 'Estado actualizado' });

    } catch {
        res.status(500).json({ error: 'Error interno' });
    }
};


// DESCARGAR HOJA DE VIDA (CV)

// Esta función permite descargar el archivo PDF del practicante
const descargarCV = async (req, res) => {
    try {

        // Se obtiene el nombre del archivo desde la base de datos
        const data = await practicanteModel.obtenerCV(req.params.id);

        // Validamos que exista un archivo asociado
        if (!data || !data.archivo_cv) {
            return res.status(404).json({ error: 'Sin archivo' });
        }

        // Se construye la ruta donde está guardado el archivo
        const ruta = path.join(__dirname, '../../uploads', data.archivo_cv);

        // Se envía el archivo para descarga al usuario
        res.download(ruta, `CV_${data.nombre_completo}.pdf`);

    } catch {
        res.status(500).json({ error: 'Error al descargar' });
    }
};


// EXPORTACIÓN

// Se exportan todas las funciones del controlador
module.exports = {
    registrar,
    listar,
    obtenerUno,
    actualizarEstado,
    descargarCV
};