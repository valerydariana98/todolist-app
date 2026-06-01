# TodoList App

Aplicación web de gestión de tareas desarrollada con React, Node.js, Express y MongoDB Atlas.

Permite crear listas de tareas, agregar tareas a cada lista, marcarlas como completadas y eliminarlas.

---

## Despliegue

### Frontend

https://todolist-app-eight-theta.vercel.app/

### Backend

https://todolist-app-wtkf.onrender.com

---

## Arquitectura

Frontend:

- React
- Vite
- CSS

Backend:

- Node.js
- Express
- MongoDB Atlas
- Mongoose
- Zod

Infraestructura:

- Vercel (Frontend)
- Render (Backend)
- MongoDB Atlas (Base de Datos)

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
│   └── package.json
│
└── README.md
```

---

## Funcionalidades

### Listas

- Crear listas
- Consultar listas
- Actualizar listas
- Eliminar listas

### Tareas

- Crear tareas
- Consultar tareas
- Actualizar tareas
- Marcar tareas como completadas
- Eliminar tareas

---

## Instalación Local

### Requisitos

Instalar:

- Node.js 18 o superior
- npm
- MongoDB Atlas (o MongoDB local)

Verificar instalación:

```bash
node -v
npm -v
```

---

## Backend

Entrar al directorio:

```bash
cd backend
```

Instalar dependencias:

```bash
npm install
```

Crear archivo:

```text
.env
```

Configurar:

```env
PORT=3000
MONGO_URI=uri_de_mongodb
CLIENT_URL=http://localhost:5173
```

Ejecutar:

```bash
npm run dev
```

Servidor disponible en:

```text
http://localhost:3000
```

---

## Frontend

Entrar al directorio:

```bash
cd frontend
```

Instalar dependencias:

```bash
npm install
```

Crear archivo:

```text
.env
```

Configurar:

```env
VITE_API_URL=http://localhost:3000/api
```

Ejecutar:

```bash
npm run dev
```

Aplicación disponible en:

```text
http://localhost:5173
```

---

## Endpoints Principales

### Todo Lists

| Método | Endpoint |
|----------|----------|
| GET | /api/todolists |
| GET | /api/todolists/:id |
| POST | /api/todolists |
| PUT | /api/todolists/:id |
| DELETE | /api/todolists/:id |

### Tasks

| Método | Endpoint |
|----------|----------|
| GET | /api/tasks |
| GET | /api/tasks/:id |
| POST | /api/tasks |
| PUT | /api/tasks/:id |
| PATCH | /api/tasks/:id/completed |
| DELETE | /api/tasks/:id |
