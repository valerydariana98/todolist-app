# TodoList App

Aplicación web para la gestión de listas y tareas desarrollada con React, Node.js, Express y MongoDB Atlas.

Permite a cada usuario registrarse, iniciar sesión y administrar de forma segura sus propias listas y tareas.

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
* Axios
* CSS

### Backend

* Node.js
* Express
* MongoDB Atlas
* Mongoose
* Zod
* JWT (JSON Web Tokens)
* bcrypt

### Infraestructura

* Vercel (Frontend)
* Render (Backend)
* MongoDB Atlas (Base de Datos)

---

## Funcionalidades

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

* Contraseñas cifradas con bcrypt
* Autenticación mediante JWT
* Acceso restringido a recursos propios
* Middleware de autorización

---

## Arquitectura

Frontend:

* Presentación e interacción del usuario
* Consumo de API mediante Axios
* Gestión de autenticación

Backend:

* API REST
* Validaciones con Zod
* Controladores
* Middleware de autenticación
* Persistencia en MongoDB Atlas

Base de datos:

* Usuarios
* Listas
* Tareas

Relaciones:

Usuario → Listas → Tareas

---

## Instalación Local

### Requisitos

Instalar:

* Node.js 18 o superior
* npm
* MongoDB Atlas (o MongoDB local)

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

MONGO_URI=tu_uri_de_mongodb

CLIENT_URL=http://localhost:5173

JWT_SECRET=tu_clave_secreta

JWT_EXPIRES_IN=7d

GOOGLE_CLIENT_ID=opcional

GOOGLE_CLIENT_SECRET=opcional

GOOGLE_REDIRECT_URI=opcional
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

## Variables de Entorno

### Backend

| Variable             | Descripción                  |
| -------------------- | ---------------------------- |
| PORT                 | Puerto del servidor          |
| MONGO_URI            | Cadena de conexión a MongoDB |
| CLIENT_URL           | URL permitida por CORS       |
| JWT_SECRET           | Clave para firmar tokens     |
| JWT_EXPIRES_IN       | Tiempo de expiración del JWT |
| GOOGLE_CLIENT_ID     | Cliente OAuth de Google      |
| GOOGLE_CLIENT_SECRET | Secreto OAuth de Google      |
| GOOGLE_REDIRECT_URI  | Callback OAuth               |

### Frontend

| Variable     | Descripción        |
| ------------ | ------------------ |
| VITE_API_URL | URL base de la API |

---

## Endpoints Principales

### Autenticación

| Método | Endpoint           |
| ------ | ------------------ |
| POST   | /api/auth/register |
| POST   | /api/auth/login    |
| GET    | /api/auth/profile  |

### Todo Lists

| Método | Endpoint           |
| ------ | ------------------ |
| GET    | /api/todolists     |
| GET    | /api/todolists/:id |
| POST   | /api/todolists     |
| PUT    | /api/todolists/:id |
| DELETE | /api/todolists/:id |

### Tasks

| Método | Endpoint                 |
| ------ | ------------------------ |
| GET    | /api/tasks               |
| GET    | /api/tasks/:id           |
| POST   | /api/tasks               |
| PUT    | /api/tasks/:id           |
| PATCH  | /api/tasks/:id/completed |
| DELETE | /api/tasks/:id           |

