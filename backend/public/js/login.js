// Obtenemos el formulario de login del HTML
const form = document.getElementById('form-login');

// Contenedor donde se mostrarán mensajes (éxito o error)
const mensajeResultado = document.getElementById('mensaje-resultado');


// FUNCIÓN PARA MOSTRAR MENSAJES

// Esta función muestra mensajes al usuario dependiendo del tipo (éxito o error)
function mostrarMensaje(texto, tipo) {
  // Insertamos el texto en el contenedor
  mensajeResultado.textContent = texto;

  // Cambiamos la clase según el tipo de mensaje
  // Si es "exito" aplica estilos verdes, si no, de error
  mensajeResultado.className = `mensaje ${tipo === 'exito' ? 'exito' : 'error-msg'}`;

  // Hacemos visible el mensaje (quitamos la clase oculto)
  mensajeResultado.classList.remove('oculto');
}


// EVENTO SUBMIT DEL FORMULARIO

// Escuchamos cuando el usuario envía el formulario
form.addEventListener('submit', async (evento) => {

  // Evitamos que el formulario recargue la página
  evento.preventDefault();


  // Obtenemos los valores ingresados por el usuario
  const usuario = document.getElementById('usuario').value.trim();
  const password = document.getElementById('password').value;


  // Validación básica: que no estén vacíos
  if (!usuario || !password) {
    mostrarMensaje('Ingresa usuario y contraseña.', 'error');
    return; // detenemos la ejecución
  }


  // Obtenemos el botón para deshabilitarlo mientras se procesa el login
  const botonEnviar = form.querySelector('button[type="submit"]');

  // Evita múltiples envíos
  botonEnviar.disabled = true;

  // Cambiamos el texto del botón para dar feedback al usuario
  botonEnviar.textContent = 'Ingresando...';


  try {
    // Enviamos la petición al backend
    const respuesta = await fetch('/api/auth/login', {
      method: 'POST',

      // Indicamos que enviamos JSON
      headers: { 'Content-Type': 'application/json' },

      // IMPORTANTE:
      // Permite que el navegador guarde y envíe la cookie de sesión
      // Esto es lo que mantiene al usuario "logueado"
      credentials: 'include',

      // Enviamos usuario y contraseña
      body: JSON.stringify({ usuario, password })
    });


    // Convertimos la respuesta a JSON
    const data = await respuesta.json();


    // Si la respuesta del servidor es un error
    if (!respuesta.ok) {
      mostrarMensaje(data.error || 'Credenciales incorrectas.', 'error');
      return;
    }


    // Si el login es correcto
    mostrarMensaje('¡Bienvenido! Redirigiendo al panel...', 'exito');


    // Redirigimos al panel después de un pequeño tiempo
    setTimeout(() => {
      window.location.href = 'panel.html';
    }, 600);


  } catch (error) {
    // Error de conexión (por ejemplo, servidor apagado)
    console.error('Error de red:', error);
    mostrarMensaje('No se pudo conectar con el servidor.', 'error');
  } finally {
    // Siempre se ejecuta (haya error o no)

    // Volvemos a habilitar el botón
    botonEnviar.disabled = false;

    // Restauramos el texto original
    botonEnviar.textContent = 'Ingresar';
  }
});