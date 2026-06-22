
// REFERENCIAS DEL DOM

// Formulario principal de registro
const form = document.getElementById('form-registro');

// Contenedor donde se mostrarán mensajes (éxito o error)
const mensajeResultado = document.getElementById('mensaje-resultado');


// VALIDACIONES

// Objeto que contiene las reglas de validación por cada campo
const validaciones = {

  nombre_completo: (valor) => {
    if (!valor.trim()) return 'El nombre completo es obligatorio.';
    if (valor.trim().length < 3) return 'El nombre debe tener al menos 3 caracteres.';
    return null;
  },

  correo: (valor) => {
    if (!valor.trim()) return 'El correo electrónico es obligatorio.';

    // Expresión regular básica para validar formato de correo
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!regex.test(valor)) return 'Ingresa un correo electrónico válido.';
    return null;
  },

  carrera: (valor) => {
    if (!valor.trim()) return 'La carrera universitaria es obligatoria.';
    return null;
  },

  semestre: (valor) => {
    if (!valor.trim()) return 'El semestre actual es obligatorio.';
    return null;
  }
};


// VALIDAR CAMPO INDIVIDUAL

function validarCampo(idCampo) {

  const input = document.getElementById(idCampo);

  // Ajuste para el id del error del nombre
  const spanError = document.getElementById(
    `error-${idCampo === 'nombre_completo' ? 'nombre' : idCampo}`
  );

  // Ejecuta la validación correspondiente
  const mensajeError = validaciones[idCampo](input.value);

  if (mensajeError) {
    // Si hay error, se marca el campo en rojo
    input.classList.add('campo-invalido');
    spanError.textContent = mensajeError;
    return false;
  } else {
    // Si es válido, se limpia el error
    input.classList.remove('campo-invalido');
    spanError.textContent = '';
    return true;
  }
}


// VALIDACIÓN EN TIEMPO REAL

// Se ejecuta cuando el usuario sale del campo (evento blur)
Object.keys(validaciones).forEach((idCampo) => {
  document
    .getElementById(idCampo)
    .addEventListener('blur', () => validarCampo(idCampo));
});


// MOSTRAR MENSAJES

function mostrarMensaje(texto, tipo) {
  mensajeResultado.textContent = texto;

  mensajeResultado.className = `mensaje ${tipo === 'exito' ? 'exito' : 'error-msg'}`;
  mensajeResultado.classList.remove('oculto');

  // Hace scroll automático para que el usuario vea el mensaje
  mensajeResultado.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}


// ENVÍO DEL FORMULARIO

form.addEventListener('submit', async (evento) => {

  // Evita que el navegador recargue la página
  evento.preventDefault();


  // Validamos todos los campos antes de enviar
  const camposValidos = Object.keys(validaciones)
    .map((idCampo) => validarCampo(idCampo))
    .every((esValido) => esValido === true);


  // Si hay errores, no se envía el formulario
  if (!camposValidos) {
    mostrarMensaje('Por favor corrige los errores señalados en rojo.', 'error');
    return;
  }


  // Creamos el objeto FormData para enviar datos (incluye archivos)
  const datosFormulario = new FormData(form);


  // Obtenemos el botón para evitar múltiples envíos
  const botonEnviar = form.querySelector('button[type="submit"]');

  botonEnviar.disabled = true;
  botonEnviar.textContent = 'Enviando...';


  try {
    // Enviamos los datos al backend
    const respuesta = await fetch('/api/practicantes', {
      method: 'POST',

      // No se define Content-Type porque FormData lo maneja automáticamente
      body: datosFormulario
    });


    const data = await respuesta.json();


    // Si ocurre un error en el servidor
    if (!respuesta.ok) {
      mostrarMensaje(
        data.error || 'Ocurrió un error al registrar tus datos.',
        'error'
      );
      return;
    }


    // Si todo sale bien
    mostrarMensaje(
      '¡Registro exitoso! Hemos recibido tu información correctamente.',
      'exito'
    );

    // Limpiamos el formulario
    form.reset();


  } catch (error) {
    // Error de conexión (servidor caído, red, etc.)
    console.error('Error de red:', error);

    mostrarMensaje(
      'No se pudo conectar con el servidor. Verifica que esté corriendo.',
      'error'
    );

  } finally {
    // Se ejecuta siempre

    botonEnviar.disabled = false;
    botonEnviar.textContent = 'Enviar registro';
  }
});