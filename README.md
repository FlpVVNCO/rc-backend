# READCONNECT BACKEND

Backend creado con express y mysql para challenge de lab microsystem.

[Visitar la aplicación desplegada]([https://rc-backend-production.up.railway.app/])

## Comenzando 🚀

Estas instrucciones te ayudarán a clonar y configurar el proyecto en tu máquina local para desarrollo y pruebas.

### Prerrequisitos

Antes de comenzar, asegúrate de tener instalado [Node.js](https://nodejs.org/) en tu sistema. Necesitarás una cuenta de [GitHub](https://github.com/) para clonar el repositorio.

### Instalación 🔧

_1. Clona el repositorio en tu máquina local utilizando el siguiente comando:_

   ```
   git clone URL_DEL_REPOSITORIO
   ```

_Navega al directorio del proyecto:_

   ```
   cd NOMBRE_DEL_DIRECTORIO
   ```
   
_Instala las dependencias del proyecto ejecutando el siguiente comando_


```
npm i
```

### Configuración

_Para configurar el proyecto, debes crear un archivo .env en el directorio raíz del proyecto con las siguientes variables de entorno:_

```
DB_USER='usuario de la db'
DB_HOST='host yo ocupé amazon rds'
DB_DATABASE='nombre de la db'
DB_PASSWORD='pass de tu db'
DB_PORT=3306
PORT=4000
EMAIL="email que envía los correos"
PASS_EMAIL="password del email que envía los correos"
NEXTAUTH_SECRET='clave secreta con la que creaste el token para leerlo desde nextauth'
```
_Asegúrate de reemplazar los valores con la información adecuada_

## Dependencias y Tecnologías

Este proyecto utiliza las siguientes tecnologías y dependencias:

- [Node.js](https://nodejs.org/) - Entorno de ejecución de JavaScript en el lado del servidor.
- [Express.js](https://expressjs.com/) - Framework web de Node.js utilizado para crear la aplicación web.
- [Amazon RDS](https://aws.amazon.com/rds/) - Servicio de base de datos relacional de Amazon Web Services (AWS).
- [MySQL](https://www.mysql.com/) - Sistema de gestión de bases de datos relacional utilizado en conjunto con Amazon RDS.

A continuación, se encuentran las dependencias de Node.js utilizadas en el proyecto:

- [dotenv](https://www.npmjs.com/package/dotenv) - Para cargar variables de entorno desde un archivo `.env`.
- [mysql2](https://www.npmjs.com/package/mysql2) - Controlador MySQL para Node.js utilizado para interactuar con la base de datos.
- [Express.js](https://www.npmjs.com/package/express) - El framework web utilizado para la creación de rutas y el manejo de solicitudes HTTP.
- [NextAuth.js](https://next-auth.js.org/) - Biblioteca de autenticación y autorización para aplicaciones Next.js.



