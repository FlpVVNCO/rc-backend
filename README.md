# Backend para Challenge de Lab Microsystem

Backend creado con Express.ks y MySql para challenge de lab microsystem.

[Visitar la aplicación desplegada](https://rc-backend-production.up.railway.app/)

## Comenzando 🚀

Estas instrucciones te ayudarán a clonar y configurar el proyecto en tu máquina local para desarrollo y pruebas.

### Prerrequisitos

Antes de comenzar, asegúrate de tener instalado [Node.js](https://nodejs.org/) en tu sistema. Necesitarás una cuenta de [GitHub](https://github.com/) para clonar el repositorio.

### Instalación 🔧

1. Clona el repositorio en tu máquina local utilizando el siguiente comando:

   ```
   git clone URL_DEL_REPOSITORIO
   ```

2. Navega al directorio del proyecto:

   ```
   cd NOMBRE_DEL_DIRECTORIO
   ```

3. Ve al directorio del proyecto:

   ```
   cd repo-del-frontend
   ```
   
4. Instala las dependencias del proyecto ejecutando el siguiente comando

   ```
   npm install
   ```
5. Crea un archivo `.env.local` en el directorio raíz del proyecto y configura tus variables de entorno:

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

Asegúrate de configurar las variables de entorno adecuadamente según tus necesidades.

6. Inicia el servidor de desarrollo:

   ```
      npm run dev
   ```
_El proyecto se ejecutará en `http://localhost:el-puerto-que-elijas`. Puedes acceder a él desde tu navegador._


## Diagrama de la bd mysql 

![diagrama bd](https://github.com/FlpVVNCO/rc-backend/assets/96359993/7b952c22-1c40-405e-8051-95cfa0bf3abd)

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



