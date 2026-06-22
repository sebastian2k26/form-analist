SELECCIÓN DE PRACTICANTES

Este proyecto es una aplicación sencilla para registrar practicantes y que un analista pueda revisarlos, ver su información y decidir si son viables o no.

La aplicación tiene dos partes:
- Un formulario donde los practicantes se registran.
- Un panel donde el analista revisa los registros.

--------------------------------------------
REQUISITOS

Antes de ejecutar el proyecto necesitas tener instalado:
- Node.js (versión 18 o superior)
- npm

Puedes verificarlo con:
node -v
npm -v

--------------------------------------------
INSTALACIÓN

1. Entra a la carpeta del backend en la terminal:

cd app/backend

2. Instala las dependencias:

npm install

Esto descargará todo lo necesario para que el proyecto funcione.

--------------------------------------------
EJECUCIÓN

Para iniciar el servidor:

npm start

Si todo está bien, verás un mensaje indicando que el servidor está corriendo en:
http://localhost:3000

--------------------------------------------
USO DE LA APLICACIÓN

Como practicante:
- Entrar al formulario principal
- Llenar tus datos personales
- Subir tu hoja de vida en PDF
- Enviar el registro

Como analista:
- Entrar al login
- Iniciar sesión con:
  usuario: analista
  contraseña: analista123
- Ver la lista de practicantes
- Revisar cada perfil
- Marcar como viable o no viable
- Descargar la hoja de vida si está disponible

--------------------------------------------
API (RESUMEN)

- POST /api/auth/login -> iniciar sesión
- POST /api/auth/logout -> cerrar sesión
- GET /api/practicantes -> listar practicantes
- GET /api/practicantes/:id -> ver detalle
- PUT /api/practicantes/:id/estado -> actualizar estado
- GET /api/practicantes/:id/cv -> descargar hoja de vida

--------------------------------------------
NOTAS

- El sistema usa sesiones para el login
- La base de datos es SQLite (archivo local)
- Los archivos PDF se guardan en la carpeta uploads

--------------------------------------------
