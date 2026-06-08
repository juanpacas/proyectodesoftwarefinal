# [Proeycto Barberia]

## Descripción
Sistema de gestión para de servicios para la ciudadania y para la ayuda de comerciantes.

## Tecnologías
- Frontend: React
- Backend: Express.js
- Base de datos: PocketBase

## Instalación
1. Clonar: `git clone [url]`
2. Instalar dependencias: 
   - `cd client && npm install`
   - `cd server && npm install`
3. Ejecutar: `npm start` (o el comando que uses).

## Documentación de API

http://localhost:3001/api/login
Esta api no spermite ingresar al sistema con las credenciales correctas

http://localhost:3001/api/registro
Esta api nos permite registrarnos en el sistema como cliente o proveedor

http://localhost:3001/api/servicios/${profesional.id}
Esta api nos ayuda que cuando seleccionamos un servicio nos filtra el profesional escogido

http://localhost:3001/api/guardar-servicio
esta api guarda el servicio que fue dado de alta por el proveedor

http://localhost:3001/api/servicios/${currentUser.id}
esta api nos muestra los servicios que el proveedor tiene dados de alta

http://localhost:3001/api/citas
Esta api lista las citas que fueron agendadas o estan pendientes.