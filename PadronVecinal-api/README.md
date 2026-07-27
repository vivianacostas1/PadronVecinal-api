# 🏘️ PadronVecinal

![Deployment](https://img.shields.io/badge/deploy-vercel-black?logo=vercel)
![Backend](https://img.shields.io/badge/backend-railway-0B0D0E?logo=railway)
![License](https://img.shields.io/badge/license-MIT-green)
![Node](https://img.shields.io/badge/node-%3E%3D18-339933?logo=node.js)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)

> Sistema web para la gestión de padrones vecinales, construido con Node.js, TypeScript, React y PostgreSQL.

🔗 **Demo en producción:** [https://tu-app.vercel.app](https://padron-vecinal-front-h1hzdk18w-taskweb.vercel.app/login)

---

## 📝 Descripción

**PadronVecinal** es una plataforma web pensada para administrar el registro y padrón de vecinos de una comunidad, barrio o junta vecinal. Permite dar de alta vecinos, gestionar sus datos de forma centralizada, controlar accesos mediante autenticación segura, y consultar la información del padrón desde una interfaz moderna y responsiva.

El proyecto está dividido en dos repositorios independientes:

- **Backend (API REST):** [`vivianacostas1/PadronVecinal-api`](https://github.com/vivianacostas1/PadronVecinal-api)
- **Frontend (SPA):** [`vivianacostas1/PadronVecinal-front`](https://github.com/vivianacostas1/PadronVecinal-front)

---

## 📸 Screenshot

![Screenshot](docs/screenshot.png)

---

## ✨ Features principales

- 🔐 Autenticación segura con JWT y hash de contraseñas con bcrypt
- ✅ Validación de datos de entrada con Zod
- 🧾 Registro y administración de vecinos (alta, baja, modificación)
- 🔍 Búsqueda y filtrado de vecinos dentro del padrón
- 👥 Gestión de usuarios y roles (administradores / operadores)
- 🎨 Interfaz responsiva construida con React 18 + Tailwind CSS v4
- ⚡ Frontend ultrarrápido gracias a Vite
- 🐳 Entorno de desarrollo reproducible con Docker Compose
- ☁️ Despliegue continuo (Railway + Vercel + Neon)

---

## 🛠️ Stack tecnológico

### Backend
| Tecnología | Uso |
|---|---|
| Node.js | Entorno de ejecución |
| TypeScript | Tipado estático |
| Express | Framework HTTP |
| Prisma | ORM |
| PostgreSQL | Base de datos relacional |
| JWT | Autenticación basada en tokens |
| Zod | Validación de esquemas |
| bcrypt | Hash de contraseñas |

### Frontend
| Tecnología | Uso |
|---|---|
| React 18 | Librería de UI |
| TypeScript | Tipado estático |
| Vite | Bundler y dev server |
| Tailwind CSS v4 | Estilos utility-first |
| React Router v6 | Enrutamiento SPA |
| Axios | Cliente HTTP |

### DevOps / Infraestructura
| Herramienta | Uso |
|---|---|
| Docker / docker-compose | Contenerización y entorno local |
| Railway | Hosting del backend |
| Vercel | Hosting del frontend |
| Neon | Base de datos PostgreSQL serverless |

---

## 🚀 Instalación local paso a paso

### Requisitos previos

- Node.js >= 18
- npm >= 9
- PostgreSQL (local o Neon)
- Docker y Docker Compose (opcional, ver sección Docker)

### 1. Clonar los repositorios

```bash
git clone https://github.com/vivianacostas1/PadronVecinal-api.git
git clone https://github.com/vivianacostas1/PadronVecinal-front.git
```

### 2. Backend

```bash
cd PadronVecinal-api
npm install
cp .env.example .env
# Completar las variables de entorno (ver sección siguiente)

# Generar el cliente de Prisma y aplicar migraciones
npx prisma generate
npx prisma migrate dev

# Levantar el servidor en modo desarrollo
npm run dev
```

El backend quedará disponible en `http://localhost:4000` (o el puerto definido en `.env`).

### 3. Frontend

```bash
cd PadronVecinal-front
npm install
cp .env.example .env
# Completar la URL de la API en .env

npm run dev
```

El frontend quedará disponible en `http://localhost:5173`.

---

## 🔑 Variables de entorno

### Backend (`.env.example`)

```env
# Servidor
PORT=4000
NODE_ENV=development

# Base de datos (PostgreSQL / Neon)
DATABASE_URL="postgresql://usuario:password@host:5432/padronvecinal?schema=public"

# Autenticación
JWT_SECRET="tu_secreto_super_seguro"
JWT_EXPIRES_IN="7d"

# Bcrypt
BCRYPT_SALT_ROUNDS=10

# CORS
CORS_ORIGIN="http://localhost:5173"
```

### Frontend (`.env.example`)

```env
VITE_API_URL="http://localhost:4000/api"
```

---

## 🐳 Cómo correr con Docker Compose

Desde la raíz del proyecto (backend), con Docker y Docker Compose instalados:

```bash
docker-compose up --build
```

Ejemplo de `docker-compose.yml` de referencia:

```yaml
version: "3.9"

services:
  api:
    build: .
    ports:
      - "4000:4000"
    env_file:
      - .env
    depends_on:
      - db
    command: npm run dev

  db:
    image: postgres:16-alpine
    restart: always
    environment:
      POSTGRES_USER: padronvecinal
      POSTGRES_PASSWORD: padronvecinal
      POSTGRES_DB: padronvecinal
    ports:
      - "5432:5432"
    volumes:
      - db_data:/var/lib/postgresql/data

volumes:
  db_data:
```

Para detener los contenedores:

```bash
docker-compose down
```

---

## ☁️ Despliegue en producción

### 🚂 Backend en Railway

1. Crear un nuevo proyecto en [Railway](https://railway.app) y conectar el repositorio `PadronVecinal-api`.
2. Agregar las variables de entorno (`DATABASE_URL`, `JWT_SECRET`, `CORS_ORIGIN`, etc.) en la pestaña **Variables**.
3. Si usás Neon como base de datos, copiar la connection string de Neon en `DATABASE_URL`.
4. Configurar el comando de build y start:
   ```bash
   npm run build
   npm run start
   ```
5. Railway desplegará automáticamente en cada push a la rama principal.

### ▲ Frontend en Vercel

1. Importar el repositorio `PadronVecinal-front` en [Vercel](https://vercel.com).
2. Framework preset: **Vite**.
3. Configurar la variable de entorno `VITE_API_URL` apuntando a la URL pública del backend en Railway.
4. Build command: `npm run build` — Output directory: `dist`.
5. Cada push a la rama principal dispara un nuevo despliegue automático.

### 🐘 Base de datos en Neon

1. Crear un proyecto en [Neon](https://neon.tech).
2. Copiar la connection string generada.
3. Pegarla como `DATABASE_URL` en las variables de entorno de Railway.
4. Ejecutar las migraciones de Prisma contra la base remota:
   ```bash
   npx prisma migrate deploy
   ```

---

## 📂 Estructura del proyecto

### Backend

```
PadronVecinal-api/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── src/
│   ├── controllers/
│   ├── routes/
│   ├── middlewares/
│   ├── services/
│   ├── schemas/        # Validaciones con Zod
│   ├── utils/
│   ├── config/
│   └── server.ts
├── .env.example
├── docker-compose.yml
├── Dockerfile
├── package.json
└── tsconfig.json
```

### Frontend

```
PadronVecinal-front/
├── src/
│   ├── components/
│   ├── pages/
│   ├── routes/
│   ├── hooks/
│   ├── services/        # Axios / llamadas a la API
│   ├── context/
│   ├── types/
│   ├── App.tsx
│   └── main.tsx
├── public/
├── .env.example
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.ts
```

---

## 🔌 Endpoints principales de la API

Base URL: `/api`

### Autenticación
| Método | Endpoint | Descripción |
|---|---|---|
| `POST` | `/auth/register` | Registro de nuevo usuario |
| `POST` | `/auth/login` | Inicio de sesión (devuelve JWT) |
| `GET` | `/auth/me` | Obtiene el usuario autenticado |

### Usuarios
| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/users` | Lista de usuarios |
| `GET` | `/users/:id` | Detalle de un usuario |
| `PUT` | `/users/:id` | Actualizar usuario |
| `DELETE` | `/users/:id` | Eliminar usuario |

### Vecinos
| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/vecinos` | Lista de vecinos del padrón (con filtros de búsqueda) |
| `GET` | `/vecinos/:id` | Detalle de un vecino |
| `POST` | `/vecinos` | Registrar un nuevo vecino |
| `PUT` | `/vecinos/:id` | Actualizar datos de un vecino |
| `DELETE` | `/vecinos/:id` | Dar de baja a un vecino del padrón |

> ⚠️ Todos los endpoints protegidos requieren el header `Authorization: Bearer <token>`.

---

## 🌿 Conventional Commits

Este proyecto sigue el estándar de [Conventional Commits](https://www.conventionalcommits.org/) para mantener un historial claro y generar changelogs automáticos.

```
<tipo>(<alcance opcional>): <descripción breve>
```

**Tipos utilizados:**

| Tipo | Descripción |
|---|---|
| `feat` | Nueva funcionalidad |
| `fix` | Corrección de bugs |
| `docs` | Cambios en documentación |
| `style` | Cambios de formato (sin afectar lógica) |
| `refactor` | Refactorización de código |
| `test` | Agregado o corrección de tests |
| `chore` | Tareas de mantenimiento, config, dependencias |

**Ejemplos:**

```bash
feat(vecinos): agregar endpoint de alta de vecino
fix(auth): corregir expiración del token JWT
docs(readme): actualizar instrucciones de despliegue
```

---

## 📄 Licencia

Este proyecto está bajo la licencia **MIT**. Consultá el archivo [`LICENSE`](LICENSE) para más información.

---

<p align="center">Hecho con ❤️ para simplificar la gestión de padrones vecinales.</p>
