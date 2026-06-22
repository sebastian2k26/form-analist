
// CREDENCIALES DEL ANALISTA

// Se definen las credenciales del analista
// Primero intenta leerlas desde variables de entorno (.env)
// Si no existen, usa valores por defecto

const USUARIO_ANALISTA = process.env.ANALISTA_USER || 'analista';
const PASSWORD_ANALISTA = process.env.ANALISTA_PASS || 'analista123';


// LOGIN

// Esta función se ejecuta cuando el usuario intenta iniciar sesión
const login = (req, res) => {

    // Obtenemos usuario y contraseña enviados desde el frontend
    const { usuario, password } = req.body;

    // Validamos si coinciden con las credenciales configuradas
    if (usuario === USUARIO_ANALISTA && password === PASSWORD_ANALISTA) {

        // Guardamos información en la sesión
        // Esto permite saber que el usuario está autenticado
        req.session.estaAutenticado = true;
        req.session.usuario = usuario;

        return res.json({ mensaje: 'Inicio de sesión exitoso.' });
    }

    // Si las credenciales son incorrectas
    return res.status(401).json({ error: 'Usuario o contraseña incorrectos.' });
};


// LOGOUT

// Esta función cierra la sesión del usuario
const logout = (req, res) => {

    // Destruye la sesión actual
    req.session.destroy((err) => {

        if (err) {
            return res.status(500).json({ error: 'No se pudo cerrar sesión.' });
        }

        // Elimina la cookie de sesión del navegador
        res.clearCookie('connect.sid');

        return res.json({ mensaje: 'Sesión cerrada.' });
    });
};


// ESTADO DE SESIÓN

// Esta función permite saber si el usuario está autenticado
const estado = (req, res) => {

    res.json({
        // Devuelve true o false dependiendo si existe sesión activa
        autenticado: !!(req.session && req.session.estaAutenticado)
    });
};


// EXPORTACIÓN

// Exportamos las funciones para usarlas en las rutas
module.exports = {
    login,
    logout,
    estado
};