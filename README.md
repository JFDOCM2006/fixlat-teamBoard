# TeamBoard

Aplicación web portal de equipo con tablero de notas TeamBoard.

El proyecto está desarrollado con React, Node.js, Express y PostgreSQL. Incluye autenticación mediante JWT, gestión de usuarios, gestión de notas y una función Lambda para obtener métricas del tablero.

---

## Tecnologías

### Frontend

- React
- Vite
- JavaScript
- Tailwind CSS
- Lucide React

### Backend

- Node.js
- Express
- PostgreSQL
- JWT
- bcrypt

### Infraestructura

- Docker
- Docker Compose
- AWS EC2
- AWS Lambda
- AWS S3
- AWS CloudFront
- AWS SAM
- AWS CloudFormation

---

# Estructura del proyecto

```text
team-Board/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── db/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── app.js
│   │   └── server.js
│   │
│   ├── Dockerfile
│   └── package.json
│
├── lambda/
│   ├── metrics/
│   └── template.yaml
│
├── db/
│   └── init.sql
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── ...
│
├── infra/
│   └── cloudformation.yaml
│
├── scripts/
│   ├── deploy.ps1
│   ├── deploy-lambda.ps1
│   └── destroy.ps1
│
├── Dockerfile
├── docker-compose.yml
├── package.json
└── README.md