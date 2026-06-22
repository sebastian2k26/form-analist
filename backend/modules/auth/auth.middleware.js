// RESTRICCIÓN DE ACCESO

// Este middleware se encarga de proteger rutas
// Solo permite el acceso si el usuario ya inició sesión correctamente


function requireAuth(req, res, next) {

  // Verificamos si existe una sesión activa
  // y si además el usuario está marcado como autenticado
  if (req.session && req.session.estaAutenticado) {

    // Si todo está correcto, dejamos pasar a la siguiente función o ruta
    return next();
  }

  // Si no hay sesión o no está autenticado
  // bloqueamos el acceso y devolvemos un error 401
  return res.status(401).json({
    error: 'No autorizado. Debes iniciar sesión como analista.'
  });
}


// EXPORTACIÓN

// Exportamos el middleware para poder usarlo en las rutas protegidas
module.exports = requireAuth;