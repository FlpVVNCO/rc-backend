# READCONNECT BACKEND

Backend creado con express y mysql.
link de deploy: https://rc-backend-production.up.railway.app/

## Comenzando

Estas instrucciones te ayudarán a clonar y configurar el proyecto en tu máquina local para desarrollo y pruebas.

### Prerrequisitos

Antes de comenzar, asegúrate de tener instalado [Node.js](https://nodejs.org/) en tu sistema. Necesitarás una cuenta de [GitHub](https://github.com/) para clonar el repositorio.

### Instalación

1. Clona el repositorio en tu máquina local utilizando el siguiente comando:

   sh
   git clone URL_DEL_REPOSITORIO

Navega al directorio del proyecto:


cd NOMBRE_DEL_DIRECTORIO
Instala las dependencias del proyecto ejecutando el siguiente comando:


npm i
Configuración
Para configurar el proyecto, debes crear un archivo .env en el directorio raíz del proyecto con las siguientes variables de entorno:


DB_USER='usuario de la db'
DB_HOST='host yo ocupé amazon rds'
DB_DATABASE='nombre de la db'
DB_PASSWORD='pass de tu db'
DB_PORT=3306
PORT=4000
EMAIL="email que envía los correos"
PASS_EMAIL="password del email que envía los correos"
NEXTAUTH_SECRET='clave secreta con la que creaste el token para leerlo desde nextauth'
Asegúrate de reemplazar los valores con la información adecuada.

Uso
Una vez hayas configurado todo, puedes enviarle peticiones desde tu frontend.
