# TodoList App

Aplicación web para la gestión de listas y tareas desarrollada con React, Node.js, Express y MongoDB Atlas.

Permite crear listas de tareas, agregar tareas a cada lista, editarlas, marcarlas como completadas y eliminarlas.

---

## Despliegue

### Frontend

https://todolist-app-eight-theta.vercel.app/

### Backend

https://todolist-app-wtkf.onrender.com

---

## Tecnologías Utilizadas

### Frontend

* React
* Vite
* CSS

### Backend

* Node.js
* Express
* MongoDB Atlas
* Mongoose
* Zod
* HTTPS (SSL)

### Infraestructura

* Vercel (Frontend)
* Render (Backend)
* MongoDB Atlas (Base de Datos)

---

## Estructura del Proyecto

```text
todolist-app
│
├── frontend
│   ├── src
│   │   ├── pages
│   │   ├── services
│   │   ├── utils
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   └── package.json
│
├── backend
│   ├── src
│   │   ├── controllers
│   │   ├── models
│   │   ├── routes
│   │   ├── middlewares
│   │   ├── validations
│   │   └── server.js
│   │
│   ├── certs
│   │   ├── cert.pem
│   │   └── key.pem
│   │
│   └── package.json
│
└── README.md
```

### Autenticación

* Registro de usuarios
* Inicio de sesión
* Generación de JWT
* Protección de rutas privadas
* Persistencia de sesión mediante Local Storage

### Listas

* Crear listas
* Consultar listas
* Actualizar listas
* Eliminar listas

### Tareas

* Crear tareas
* Consultar tareas
* Actualizar tareas
* Marcar tareas como completadas
* Eliminar tareas

### Seguridad

* Autenticación JWT
* Protección de rutas
* HTTPS mediante certificados SSL

---

## Instalación Local

### Requisitos

Instalar:

* Node.js 18 o superior
* npm
* MongoDB Atlas (o MongoDB local)
* OpenSSL

Verificar instalación:

```bash
node -v
npm -v
```

---

# Backend

Entrar al directorio:

```bash
cd backend
```

Instalar dependencias:

```bash
npm install
```

---

## Variables de Entorno Backend

Crear un archivo:

```text
backend/.env
```

Configurar:

```env
PORT=3000

MONGO_URI=tu_uri_de_mongodb

JWT_SECRET=tu_clave_secreta

CLIENT_URL=https://localhost:5173
```

---

## Configuración HTTPS

Crear la carpeta:

```bash
mkdir certs
```

Generar certificados SSL:

### Linux / Git Bash

```bash
openssl req -nodes -new -x509 \
-keyout certs/key.pem \
-out certs/cert.pem \
-days 365
```

### Windows PowerShell

```bash
"C:\Program Files\OpenSSL-Win64\bin\openssl.exe" req -nodes -new -x509 -keyout certs/key.pem -out certs/cert.pem -days 365
```

Durante la generación se solicitarán algunos datos como:

```text
Country Name
State
Locality
Organization
Common Name
Email
```

Se puede ingresar cualquier valor.

Al finalizar se generarán:

```text
backend/certs/key.pem
backend/certs/cert.pem
```

---

## Ejecutar Backend

```bash
npm run dev
```

Servidor disponible en:

```text
https://localhost:3000
```

---

# Frontend

Entrar al directorio:

```bash
cd frontend
```

Instalar dependencias:

```bash
npm install
```

---

## Variables de Entorno Frontend

Crear un archivo:

```text
frontend/.env
```

Configurar:

```env
VITE_API_URL=https://localhost:3000/api
```

---

## Ejecutar Frontend

```bash
npm run dev
```

Aplicación disponible en:

```text
https://localhost:5173
```

---

## Orden Correcto de Ejecución

1. Configurar MongoDB Atlas.
2. Crear archivo `.env` en backend.
3. Crear archivo `.env` en frontend.
4. Generar certificados SSL.
5. Ejecutar backend.
6. Ejecutar frontend.

---

## Base de Datos de Prueba

Se adjunta una base de datos exportada para realizar pruebas del sistema.

La base de datos contiene:

* Usuarios
* Listas
* Tareas

Puede importarse mediante MongoDB Compass o herramientas de importación de MongoDB.

---

## Endpoints Principales

### Auth

| Método | Endpoint           |
| ------ | ------------------ |
| POST   | /api/auth/register |
| POST   | /api/auth/login    |
| GET    | /api/auth/profile  |

---

### Todo Lists

| Método | Endpoint           |
| ------ | ------------------ |
| GET    | /api/todolists     |
| GET    | /api/todolists/:id |
| POST   | /api/todolists     |
| PUT    | /api/todolists/:id |
| DELETE | /api/todolists/:id |

---

### Tasks

| Método | Endpoint                 |
| ------ | ------------------------ |
| GET    | /api/tasks               |
| GET    | /api/tasks/:id           |
| POST   | /api/tasks               |
| PUT    | /api/tasks/:id           |
| PATCH  | /api/tasks/:id/completed |
| DELETE | /api/tasks/:id           |

---

## Archivos No Incluidos

Por motivos de seguridad NO se incluyen en el repositorio:

```text
.env
certs/key.pem
certs/cert.pem
node_modules
```

Cada desarrollador debe generar y configurar estos archivos localmente siguiendo las instrucciones anteriores.
