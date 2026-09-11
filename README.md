# TeamBoard

Aplicación web para la gestión de notas y seguimiento de su estado, desarrollada como prueba técnica para FixLat.

TeamBoard permite autenticar usuarios, gestionar notas, controlar permisos mediante roles y consultar métricas generales desde un dashboard.

---

# 1. Tecnologías utilizadas

## Frontend

- React
- Vite
- JavaScript
- Tailwind CSS
- React Router
- Lucide React

## Backend

- Node.js
- Express
- JavaScript
- PostgreSQL
- JWT
- bcrypt
- pg
- CORS

## Infraestructura y despliegue

- Docker
- Docker Compose
- AWS Lambda
- AWS SAM
- AWS CloudFormation
- AWS EC2
- AWS S3
- AWS CloudFront
- AWS CLI

---

# 2. Requisitos

Para ejecutar el proyecto localmente se requiere:

- Node.js 22 o superior
- Docker Desktop
- Docker Compose
- AWS SAM CLI
- Git

AWS SAM CLI solamente es necesario para ejecutar la función Lambda localmente.

No es necesario contar con una cuenta de AWS para ejecutar y demostrar el proyecto completamente en local.

La ejecución local no depende de un despliegue remoto ni de una suscripción de pago.

---

# 3. Clonar el repositorio

Clonar el repositorio:


git clone https://github.com/JFDOCM2006/fixlat-teamBoard.git

Ingresar a la carpeta:
cd fixlat-teamBoard

# 4. Estructura del proyecto

team-Board/
│
├── backend/
│   ├── src/
│   ├── Dockerfile
│   ├── package.json
│   └── package-lock.json
│
├── db/
│   └── init.sql
│
├── infra/
│   └── cloudformation.yaml
│
├── lambda/
│   ├── metrics/
│   │   ├── app.js
│   │   └── package.json
│   │
│   └── template.yaml
│
├── public/
│
├── scripts/
│   ├── deploy.ps1
│   ├── deploy-lambda.ps1
│   └── destroy.ps1
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── ...
│
├── Dockerfile.frontend
├── docker-compose.yml
├── index.html
├── package.json
├── package-lock.json
├── README.md
└── vite.config.js

# 5. Ejecución local
Para ejecutar el proyecto mediante Docker Compose, desde la raíz del proyecto, ejecutar:

docker compose up --build

Este comando construye las imágenes y levanta los servicios necesarios.

Los servicios principales son:

- PostgreSQL
- Backend
- Frontend

# 6. Servicios locales
Después de iniciar Docker Compose, los servicios estarán disponibles en:

Frontend
http://localhost:5173
Si el puerto 5173 se encuentra ocupado, Vite puede iniciar automáticamente en otro puerto, por ejemplo 5174.

Backend
http://localhost:3000

PostgreSQL
El puerto se define en la configuración de Docker Compose.


# 7. Detener el entorno
Script para detener los contenedores:
docker compose down

Script para detener los contenedores y eliminar los volúmenes:
docker compose down -v


# 8. Persistencia
La aplicación utiliza PostgreSQL como sistema de persistencia.

Docker Compose crea un volumen llamado:
postgres_data

Este volumen permite mantener los datos de la base de datos aunque los contenedores se detengan.

Por ejemplo:
docker compose down

detiene y elimina los contenedores, pero conserva el volumen

Por el contrario:

docker compose down -v

elimina también el volumen y, por lo tanto, los datos almacenados

# 9. Inicialización de la base de datos

La base de datos se inicializa mediante:

db/init.sql

Docker Compose monta este archivo en el directorio de inicialización de PostgreSQL:

/docker-entrypoint-initdb.d/

Durante la primera creación del volumen de PostgreSQL, el script es ejecutado para crear las tablas necesarias.

Las principales tablas utilizadas por la aplicación son:

- users
- notes

# 10. Reinicializar la base de datos
Si se desea comenzar nuevamente con una base de datos limpia:

docker compose down -v

Después:

docker compose up --build

Al crear nuevamente el volumen, PostgreSQL ejecutará el archivo:

db/init.sql

# 11. Autenticación

TeamBoard utiliza autenticación basada en JWT.

Flujo de autenticación:

usuario -> inicio de sesión -> backend -> validación de credenciales -> JWT -> frontend

Las contraseñas se almacenan mediante un hash generado con bcrypt.

Después de iniciar sesión correctamente, el backend genera un token JWT que se utiliza
para acceder a las rutas protegidas.

# 12. Roles de usuario

La aplicación maneja dos roles:
- ADMIN
- USER

ADMIN: el rol de administrador tiene acceso a:

- Dashboard
- Tablero
- Gestión de usuarios

Puede:
- Crear usuarios
- Editar usuarios
- Cambiar roles
- Activar usuarios
- Desactivar usuarios
- Eliminar usuarios

USER: el rol de usuario cuenta con los siguientes accesos:

- Dashboard
- Tablero


# 13. Cuentas de demostración

El proyecto tiene almacenadas las siguientes cuentas de prueba:

1. Nombre: Juan Fernando, correo electrónico: juan2@test.com, rol: ADMIN
2. Nombre: Diego Fernando, correo electrónico: diferechoc@gmail.com, rol: USER

# 14. Gestión de notas

Cada nota contiene:
- Título
- Contenido
- Estado

Los estados disponibles son:
- Pendiente
- En curso
- Hecho

El usuario puede:
- Crear notas
- Editar notas
- Modificar el título
- Modificar el contenido
- Cambiar el estado
- Guardar los cambios

Los cambios están relacionados con el usuario. Es decir, si el usuario cambia la posición de las notas, los datos de posición
se almacenan junto con los demás cambios en la tabla `notes` de la base de datos.

# 15. Comportamiento

Durante la edición de una nota, los cambios realizados permanecen temporalmente mientras el usuario cambia entre los diferentes campos de la tarjeta.

Si el usuario hace clic fuera de la tarjeta sin guardar los cambios, las modificaciones pendientes se cancelan y se recuperan los valores almacenados anteriormente.

Al guardar, los nuevos valores son enviados al backend y persistidos en PostgreSQL.


# 16. Dashboard

El dashboard muestra las métricas relacionadas con las notas existentes.

Las métricas principales son:

- Total de notas.
- Notas pendientes.
- Notas en curso.
- Notas completadas.

Ejemplo:

Total: 10

Pendientes: 4
En curso: 3
Hechas: 3

Las cifras corresponden a los datos almacenados en la tabla notes.

Las métricas pueden actualizarse al volver a abrir o recargar el dashboard.


# 17. AWS Lambda

Las métricas pueden actualizarse al volver a abrir o recargar el dashboard.

La función se encuentra en:

lambda/metrics/app.js

La configuración de AWS SAM se encuentra en:
lambda/template.yml

La función Lambda consulta PostgreSQL y obtiene:

total,
pendientes,
en_curso,
hechos

La respuesta se entrega en formato JSON.

Ejemplo:

{
    "total": 0,
    "pendientes": 0,
    "en_curso": 0,
    "hechos": 0
}

# 18. Ejecutar Lambda localmente

AWS SAM permite ejecutar la función Lambda localmente sin necesidad de desplegarla en AWS.

Ingresar a la carpeta:

cd lambda

Construir la aplicación:

sam build

Iniciar la API local:

sam local start-api --port 3001

La función estará disponible en:

http://localhost:3001/metrics

Para detener la ejecución de la API: `Ctrl + C`.

Durante la ejecución local, la función Lambda utiliza la configuración definida en:

DB_HOST
DB_PORT
DB_NAME
DB_USER
DB_PASSWORD

La configuración permite que la Lambda ejecutada mediante SAM pueda consultar la base de datos PostgreSQL utilizada por el entorno local.

# 19. Arquitectura local

La arquitectura local puede representarse de la siguiente manera:

                         ┌────────────────────┐
                         │      Frontend      │
                         │   React + Vite     │
                         └─────────┬──────────┘
                                   │
                                   ▼
                         ┌────────────────────┐
                         │      Backend       │
                         │ Node.js + Express  │
                         └─────────┬──────────┘
                                   │
                                   ▼
                         ┌────────────────────┐
                         │     PostgreSQL     │
                         │      Docker        │
                         └────────────────────┘
                                   ▲
                                   │
                                   │
                         ┌─────────┴──────────┐
                         │    AWS Lambda      │
                         │    SAM Local       │
                         │     Métricas       │
                         └────────────────────┘

La ejecución local no depende de una cuenta de AWS.

# 20. Arquitectura AWS

La arquitectura prevista para el despliegue en AWS contempla los siguientes componentes:

                         Internet
                            │
                            ▼
                    ┌────────────────┐
                    │   CloudFront   │
                    └───────┬────────┘
                            │
                            ▼
                    ┌────────────────┐
                    │       S3       │
                    │    Frontend    │
                    └────────────────┘


                    ┌────────────────┐
                    │      EC2       │
                    │     Docker     │
                    │ Node + Express │
                    └───────┬────────┘
                            │
                            ▼
                       PostgreSQL


                    ┌────────────────┐
                    │     Lambda     │
                    │    Métricas    │
                    └───────┬────────┘
                            │
                            ▼
                       PostgreSQL

EC2

La API de usuarios y notas está preparada para ejecutarse dentro de un contenedor Docker en una instancia EC2.

Lambda

Lambda se utiliza para calcular y entregar las métricas del dashboard.

S3

S3 está contemplado como almacenamiento para los archivos del frontend en el escenario de despliegue en AWS.

CloudFront

CloudFront está contemplado como servicio de distribución del frontend.

PostgreSQL

PostgreSQL se utiliza como sistema de persistencia para usuarios y notas.

# 21. Infraestructura como código

La infraestructura principal de AWS se encuentra definida mediante CloudFormation:

infra/cloudformation.yml

La función Lambda está definida mediante AWS SAM:

lambda/template.yml

Los scripts de despliegue y retirada se encuentran en:

scripts/

Archivos:
- destroy.ps1
- deploy-lambda.ps1
- deploy.ps1

# 22. Despliegue de infraestructura AWS

El despliegue real en AWS es opcional.

No es necesario desplegar recursos AWS para ejecutar y demostrar el proyecto localmente.

Si se desea realizar el despliegue, se requiere:

- Una cuenta de AWS.
- AWS CLI configurado.
- AWS SAM CLI.
- Credenciales de AWS.
- Permisos suficientes para los servicios utilizados.
- Una AMI válida de Amazon Linux.

# 23. Desplegar infraestructura principal

.\scripts\deploy.ps1 -AmiId ami-xxxxxxxxxxxxxxxxx

También se puede especificar la región:

.\scripts\deploy.ps1 `
  -Region us-east-1 `
  -AmiId ami-xxxxxxxxxxxxxxxxx

El parámetro AmiId corresponde al identificador del AMI de Amazon Linux que será utilizado para crear la instancia EC2.

El script realiza el despliegue mediante AWS CloudFormation.

# 24. Desplegar Lambda

Para desplegar Lambda:

.\scripts\deploy-lambda.ps1

También se puede especificar la región:

.\scripts\deploy-lambda.ps1 -Region us-east-1

El script ejecuta:

sam build
Preparación del paquete de despliegue.
Despliegue mediante AWS SAM.
Creación o actualización del stack correspondiente.


# 25. Retirar infraestructura AWS

Para eliminar la infraestructura principal y Lambda:

.\scripts\destroy.ps1

También se puede especificar la región:

.\scripts\destroy.ps1 `
-Region us-east-1

El script elimina los stacks de CloudFormation utilizados por el proyecto.

# 26. Ejecución sin AWS

Una de las condiciones principales del proyecto es que pueda demostrarse completamente
en local.

Por esta razón:

- El frontend puede ejecutarse mediante Docker
- El backend puede ejecutarse mediante Docker
- PostgreSQL se ejecuta mediante Docker.
- Lambda puede ejecutarse mediante AWS SAM Local.

# 27. API

El backend expone las rutas principales de autenticación, usuarios y notas.

Autenticación

POST /api/auth/register
POST /api/auth/login

Notas

GET /api/notes
POST /api/notes
PUT /api/notes/:id
DELETE /api/notes/:id

Usuarios

GET /api/users
POST /api/users
PUT /api/users/:id

Las rutas protegidas requieren autenticación mediante JWT.

# 28. Seguridad y autorización

La aplicación utiliza JWT para la autenticación.

El backend valida el token antes de permitir el acceso a las rutas protegidas.

Además, se valida el estado activo del usuario.

Un usuario desactivado no puede continuar utilizando las rutas protegidas del sistema.

Las funciones administrativas están restringidas a usuarios con rol:

ADMIN

La interfaz también controla la visualización de las opciones según el rol del usuario.


# 29. Tiempo empleado

El desarrollo se realizó dentro del plazo establecido para la prueba técnica:

3 días + horas adicionales disponibles para la entrega

- Análisis de requerimientos.
- Diseño de la interfaz.
- Desarrollo del frontend.
- Desarrollo del backend.
- Implementación de autenticación.
- Implementación de roles.
- Desarrollo del tablero.
- Persistencia en PostgreSQL.
- Dashboard.
- Integración con Lambda.
- Configuración de Docker.
- Configuración de AWS SAM.
- Infraestructura como código.
- Pruebas y correcciones.
- Documentación.
- Preparación de la entrega.

# 30. Alcance

El proyecto se concentra en las funcionalidades solicitadas para la prueba técnica.

Se incluyen:
- Autenticación.
- Registro de usuarios.
- Roles de usuario.
- Administración de usuarios.
- Creación de notas.
- Edición de notas.
- Estados de las notas.
- Persistencia.
- Dashboard.
- Métricas mediante Lambda.
- Ejecución local.
- Docker.
- AWS SAM.
- CloudFormation.
- Scripts de despliegue y retirada.

# 31. Limitaciones y pendientes conocidos

Por alcance de la prueba técnica no se implementaron funcionalidades adicionales como:
- Múltiples tableros.
- Columnas configurables.
- Asignación de notas.
- Fechas de vencimiento.
- Comentarios.
- Adjuntos.
- Notificaciones.
- Historial de cambios.
- Colaboración en tiempo real.
- Aplicaciones móviles nativas.

El despliegue real en AWS no forma parte de la entrega obligatoria.

La infraestructura AWS se encuentra preparada mediante AWS SAM, CloudFormation y scripts de despliegue, pero la demostración principal se realiza completamente en local.

Algunos recursos AWS requieren parámetros específicos de la cuenta y región antes de realizar un despliegue real.

# 32. Scripts disponibles

Los scripts disponibles son:

Desplegar infraestructura:
scripts/deploy.ps1

Desplegar Lambda:
scripts/deploy-lambda.ps1

Eliminar infraestructura:
scripts/destroy.ps1

# 33. Comandos principales

- Levantar aplicación
docker compose up --build

- Detener la aplicación
docker compose down

- Eliminar datos y contenedores
docker compose down -v

- Construir Lambda
cd lambda
sam build

- Ejecutar Lambda localmente
sam local start-api --port 3001

# 34. Resumen

TeamBoard implementa una solución completa para la gestión de notas con autenticación, autorización, persistencia y métricas.

La aplicación puede ejecutarse y demostrarse completamente en local utilizando Docker Compose y AWS SAM Local, sin depender de una cuenta de AWS.

La arquitectura AWS se encuentra preparada mediante CloudFormation y AWS SAM, contemplando EC2 para la API, Lambda para las métricas y S3/CloudFront para la distribución del frontend.