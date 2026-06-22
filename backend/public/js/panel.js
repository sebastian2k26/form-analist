
// REFERENCIAS DEL DOM

// Contenedor donde se mostrarán los practicantes
const listaPracticantes = document.getElementById('lista-practicantes');

// Contenedor de mensajes (éxito o error)
const mensajeResultado = document.getElementById('mensaje-resultado');

// Elementos del modal (ventana emergente)
const modal = document.getElementById('modal-detalle');
const modalCuerpo = document.getElementById('modal-cuerpo');

// Botones de filtro (Todos, Pendientes, etc.)
const botonesFiltro = document.querySelectorAll('.filtro');


// VARIABLES GLOBALES

// Guarda todos los practicantes cargados desde el backend
let todosLosPracticantes = [];

// Guarda el filtro actual seleccionado
let filtroActual = 'todos';


// Diccionario para mostrar nombres más amigables del estado
const ETIQUETAS_ESTADO = {
  pendiente: 'Pendiente',
  viable: 'Viable',
  no_viable: 'No viable'
};


// VERIFICAR SESIÓN

// Verifica si el usuario está autenticado antes de acceder al panel
async function verificarSesion() {
  try {
    const respuesta = await fetch('/api/auth/estado', { credentials: 'include' });
    const data = await respuesta.json();

    // Si no está autenticado, lo redirige al login
    if (!data.autenticado) {
      window.location.href = 'login.html';
    }

  } catch (error) {
    console.error('Error verificando sesión:', error);

    // Si hay error, también redirige al login
    window.location.href = 'login.html';
  }
}


// MOSTRAR MENSAJES

function mostrarMensaje(texto, tipo) {
  mensajeResultado.textContent = texto;

  mensajeResultado.className = `mensaje ${tipo === 'exito' ? 'exito' : 'error-msg'}`;
  mensajeResultado.classList.remove('oculto');

  // El mensaje desaparece después de unos segundos
  setTimeout(() => mensajeResultado.classList.add('oculto'), 3500);
}


// CARGAR PRACTICANTES

async function cargarPracticantes() {

  // Mensaje de carga mientras se obtienen los datos
  listaPracticantes.innerHTML = '<p class="cargando">Cargando practicantes...</p>';

  try {
    const respuesta = await fetch('/api/practicantes', { credentials: 'include' });

    // Si no está autenticado, redirige al login
    if (respuesta.status === 401) {
      window.location.href = 'login.html';
      return;
    }

    // Si ocurre otro error
    if (!respuesta.ok) {
      throw new Error('No se pudo obtener la lista de practicantes.');
    }

    // Guardamos los datos en memoria
    todosLosPracticantes = await respuesta.json();

    // Renderizamos la lista en pantalla
    renderizarLista();

  } catch (error) {
    console.error(error);

    listaPracticantes.innerHTML =
      '<p class="cargando">Ocurrió un error al cargar los practicantes.</p>';
  }
}


// RENDERIZAR LISTA

function renderizarLista() {

  // Filtramos según el estado seleccionado
  const practicantesFiltrados = filtroActual === 'todos'
    ? todosLosPracticantes
    : todosLosPracticantes.filter((p) => p.estado === filtroActual);

  // Si no hay datos
  if (practicantesFiltrados.length === 0) {
    listaPracticantes.innerHTML =
      '<p class="cargando">No hay practicantes en esta categoría.</p>';
    return;
  }

  // Generamos el HTML dinámicamente
  listaPracticantes.innerHTML = practicantesFiltrados.map((p) => `
    <article class="tarjeta-practicante" data-id="${p.id}">
      <span class="badge ${p.estado}">${ETIQUETAS_ESTADO[p.estado]}</span>

      <h3>${escaparHTML(p.nombre_completo)}</h3>

      <p class="meta">
        ${escaparHTML(p.carrera)} — ${escaparHTML(p.semestre)}
      </p>

      <p class="meta">${escaparHTML(p.correo)}</p>

      <div class="acciones-tarjeta">
        <button class="btn-viable" data-id="${p.id}" data-estado="viable">
          ✓ Viable
        </button>

        <button class="btn-no-viable" data-id="${p.id}" data-estado="no_viable">
          ✕ No viable
        </button>
      </div>
    </article>
  `).join('');
}


// SEGURIDAD (ANTI XSS)

// Evita que se inyecte código malicioso en el HTML
function escaparHTML(texto) {
  const div = document.createElement('div');
  div.textContent = texto ?? '';
  return div.innerHTML;
}


// MODAL (DETALLE)

function abrirDetalle(id) {

  const practicante = todosLosPracticantes.find((p) => p.id === Number(id));
  if (!practicante) return;

  // Construimos el contenido del modal
  modalCuerpo.innerHTML = `
    <h2>${escaparHTML(practicante.nombre_completo)}</h2>

    <span class="badge ${practicante.estado}">
      ${ETIQUETAS_ESTADO[practicante.estado]}
    </span>

    <dl>
      <dt>Correo electrónico</dt>
      <dd>${escaparHTML(practicante.correo)}</dd>

      <dt>Carrera</dt>
      <dd>${escaparHTML(practicante.carrera)}</dd>

      <dt>Semestre</dt>
      <dd>${escaparHTML(practicante.semestre)}</dd>

      <dt>Fecha de registro</dt>
      <dd>${new Date(practicante.fecha_registro).toLocaleString('es-CO')}</dd>
    </dl>

    <div class="acciones-tarjeta" style="margin-top:18px;">
      <button class="btn-viable" data-id="${practicante.id}" data-estado="viable">
        ✓ Marcar viable
      </button>

      <button class="btn-no-viable" data-id="${practicante.id}" data-estado="no_viable">
        ✕ Marcar no viable
      </button>
    </div>

    ${
      practicante.archivo_cv
        ? `<button class="boton-secundario" style="width:100%; margin-top:10px;"
            id="btn-descargar-cv" data-id="${practicante.id}">
            Descargar hoja de vida
           </button>`
        : `<p class="meta" style="margin-top:10px;">
            No se cargó hoja de vida.
           </p>`
    }
  `;

  // Mostramos el modal
  modal.classList.remove('oculto');
}


// Cierra el modal
function cerrarModal() {
  modal.classList.add('oculto');
}


// ACTUALIZAR ESTADO

async function actualizarEstado(id, nuevoEstado) {
  try {
    const respuesta = await fetch(`/api/practicantes/${id}/estado`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ estado: nuevoEstado })
    });

    const data = await respuesta.json();

    if (!respuesta.ok) {
      mostrarMensaje(data.error || 'No se pudo actualizar el estado.', 'error');
      return;
    }

    mostrarMensaje(`Estado actualizado a "${ETIQUETAS_ESTADO[nuevoEstado]}".`, 'exito');

    cerrarModal();

    // Recargamos la lista para reflejar cambios
    await cargarPracticantes();

  } catch (error) {
    console.error(error);
    mostrarMensaje('Error de conexión al actualizar el estado.', 'error');
  }
}


// DESCARGAR CV

function descargarCV(id) {

  // Abre el archivo en otra pestaña
  window.open(`/api/practicantes/${id}/cv`, '_blank');
}


// CERRAR SESIÓN

async function cerrarSesion() {
  try {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include'
    });
  } finally {
    // Redirige al login
    window.location.href = 'login.html';
  }
}


// EVENTOS

// Click en tarjetas o botones
listaPracticantes.addEventListener('click', (evento) => {

  const botonEstado = evento.target.closest('[data-estado]');
  const tarjeta = evento.target.closest('.tarjeta-practicante');

  // Si se hace clic en botón de estado
  if (botonEstado) {
    evento.stopPropagation(); // evita abrir el modal
    actualizarEstado(botonEstado.dataset.id, botonEstado.dataset.estado);
    return;
  }

  // Si se hace clic en la tarjeta
  if (tarjeta) {
    abrirDetalle(tarjeta.dataset.id);
  }
});


// Eventos dentro del modal
modalCuerpo.addEventListener('click', (evento) => {

  const botonEstado = evento.target.closest('[data-estado]');
  const botonDescargar = evento.target.closest('#btn-descargar-cv');

  if (botonEstado) {
    actualizarEstado(botonEstado.dataset.id, botonEstado.dataset.estado);
  }

  if (botonDescargar) {
    descargarCV(botonDescargar.dataset.id);
  }
});


// Botón cerrar modal
document.getElementById('cerrar-modal').addEventListener('click', cerrarModal);

// Cerrar modal al hacer clic fuera
modal.addEventListener('click', (evento) => {
  if (evento.target === modal) cerrarModal();
});


// Filtros
botonesFiltro.forEach((boton) => {
  boton.addEventListener('click', () => {

    // Quitamos activo a todos
    botonesFiltro.forEach((b) => b.classList.remove('activo'));

    // Activamos el seleccionado
    boton.classList.add('activo');

    // Guardamos filtro
    filtroActual = boton.dataset.filtro;

    // Renderizamos de nuevo
    renderizarLista();
  });
});


// Botón logout
document.getElementById('btn-logout').addEventListener('click', cerrarSesion);


// INICIALIZACIÓN

// Función autoejecutable al cargar la página
(async function inicializar() {
  await verificarSesion();     // valida sesión
  await cargarPracticantes();  // carga datos
})();