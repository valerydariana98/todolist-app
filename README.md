# TodoList App

Aplicación web para gestión de listas y tareas desarrollada con React, Node.js, Express y MongoDB Atlas.

Permite crear listas, agregar tareas, editarlas, marcarlas como completadas, eliminarlas y adjuntar archivos de Google Drive por tarea.

---

## Demo en línea

| Servicio  | URL |
|-----------|-----|
| Frontend  | https://todolist-app-eight-theta.vercel.app/ |
| Backend   | https://todolist-app-wtkf.onrender.com |

### Usuario de prueba

| Campo      | Valor               |
|------------|---------------------|
| Email      | camitkdos@gmail.com |
| Contraseña | cami123             |

---

## Tecnologías

| Capa           | Tecnologías                              |
|----------------|------------------------------------------|
| Frontend       | React, Vite, CSS                         |
| Backend        | Node.js, Express, HTTPS (SSL)            |
| Base de datos  | MongoDB Atlas, Mongoose                  |
| Validación     | Zod                                      |
| Infraestructura| Vercel (frontend), Render (backend)      |

---

## Instalación local

### Requisitos previos

Instalar antes de continuar:

- [Node.js 18 o superior](https://nodejs.org/)
- [Git](https://git-scm.com/)
- OpenSSL (en Linux ya viene instalado; en Windows ver paso 3)

Verificar:

```bash
node -v
npm -v
openssl version
```

---

### Paso 1 — Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/todolist-app.git
cd todolist-app
```

---

### Paso 2 — Instalar dependencias

Backend:

```bash
cd backend
npm install
```

Frontend:

```bash
cd ../frontend
npm install
```

---

### Paso 3 — Instalar OpenSSL (solo Windows)

Descargar e instalar desde: https://slproweb.com/products/Win32OpenSSL.html

Verificar:

```powershell
& "C:\Program Files\OpenSSL-Win64\bin\openssl.exe" version
```

---

### Paso 4 — Generar certificados SSL

Desde la raíz del proyecto crear la carpeta:

```bash
mkdir backend/certs
```

Generar los certificados:

**Linux / Mac:**

```bash
openssl req -nodes -new -x509 \
  -keyout backend/certs/key.pem \
  -out backend/certs/cert.pem \
  -days 365
```

**Windows PowerShell:**

```powershell
& "C:\Program Files\OpenSSL-Win64\bin\openssl.exe" req -nodes -new -x509 -keyout backend/certs/key.pem -out backend/certs/cert.pem -days 365
```

Cuando pida datos se puede presionar Enter para saltar cada campo.

Al finalizar deben existir:

```
backend/certs/key.pem
backend/certs/cert.pem
```

---

### Paso 5 — Configurar variables de entorno

**Backend** — crear el archivo `backend/.env`:

```env
PORT=3000
MONGO_URI=mongodb+srv://<usuario>:<contraseña>@cluster0.xxxxx.mongodb.net/todolistdb
JWT_SECRET=cualquier_texto_secreto
JWT_EXPIRES_IN=7d
CLIENT_URL=https://localhost:5173
GOOGLE_CLIENT_ID=tu_google_client_id
GOOGLE_CLIENT_SECRET=tu_google_client_secret
GOOGLE_REDIRECT_URI=https://localhost:3000/api/auth/google/callback
```

**Frontend** — crear el archivo `frontend/.env`:

```env
VITE_API_URL=https://localhost:3000/api
```

---

### Paso 6 — Configurar Vite para HTTPS

Editar `frontend/vite.config.js`:

```javascript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";

export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: fs.readFileSync("../backend/certs/key.pem"),
      cert: fs.readFileSync("../backend/certs/cert.pem"),
    },
    proxy: {
      "/api": {
        target: "https://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
```

---

### Paso 7 — Ejecutar la aplicación

Abrir **dos terminales**:

**Terminal 1 — Backend:**

```bash
cd backend
npm run dev
```

Debe aparecer:

```
MongoDB conectado
Servidor HTTPS corriendo en puerto 3000
```

**Terminal 2 — Frontend:**

```bash
cd frontend
npm run dev
```

---

### Paso 8 — Aceptar el certificado local

Abrir en el navegador:

```
https://localhost:3000
```

Va a aparecer una advertencia de seguridad. Seleccionar:

```
Opciones avanzadas → Continuar a localhost
```

Luego abrir la aplicación en:

```
https://localhost:5173
```

---

## Estructura del proyecto

```
todolist-app/
├── frontend/
│   └── src/
│       ├── pages/
│       ├── services/
│       ├── utils/
│       ├── App.jsx
│       └── main.jsx
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middlewares/
│   │   ├── validations/
│   │   └── server.js
│   └── certs/          ← generado localmente, no incluido en el repo
│
└── README.md
```

---

## Endpoints principales

### Autenticación

| Método | Endpoint            |
|--------|---------------------|
| POST   | /api/auth/register  |
| POST   | /api/auth/login     |
| GET    | /api/auth/profile   |

### Listas

| Método | Endpoint            |
|--------|---------------------|
| GET    | /api/todolists      |
| POST   | /api/todolists      |
| PUT    | /api/todolists/:id  |
| DELETE | /api/todolists/:id  |

### Tareas

| Método | Endpoint                  |
|--------|---------------------------|
| GET    | /api/tasks                |
| POST   | /api/tasks                |
| PUT    | /api/tasks/:id            |
| PATCH  | /api/tasks/:id/completed  |
| DELETE | /api/tasks/:id            |

### Archivos (Google Drive)

| Método | Endpoint                       |
|--------|--------------------------------|
| GET    | /api/tasks/:id/files           |
| POST   | /api/tasks/:id/files           |
| DELETE | /api/tasks/:id/files/:fileId   |

---

## Archivos no incluidos en el repositorio

Por seguridad estos archivos deben generarse localmente:

```
backend/.env
backend/certs/key.pem
backend/certs/cert.pem
frontend/.env
```