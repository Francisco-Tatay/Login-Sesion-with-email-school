# Login Sesion with Email School

Aplicacion full-stack con autenticacion, registro, recuperacion de contrasena y vista de prueba para eliminacion de usuario.  
Frontend en Vue 3 + Vite, backend en Express + MySQL.

## Que incluye el proyecto

- Login con email y password
- Registro de usuarios
- Recuperacion de contrasena por email
- Eliminacion de usuario por email (flujo de prueba conectado)
- Landing principal con 3 opciones:
  - Login
  - Register
  - Login Delete
- Estilos responsive en vistas principales de autenticacion
- Store con Pinia + capa de servicios HTTP

## Stack Tecnologico

### Frontend

- Vue 3
- Vite
- Vue Router
- Pinia
- Axios
- ESLint + Prettier + Oxlint

### Backend

- Node.js
- Express
- MySQL
- bcrypt
- jsonwebtoken
- nodemailer
- helmet, cors, morgan, dotenv

---

## Estructura General

```txt
Login-Sesion-with-email-school-/
  Backend/
    app.js
    server.js
    Controller/
      UserController.js
    routes/
      index.js
    Data/
      Db.js
  Frontend/
    src/
      App.vue
      main.js
      router/index.js
      services/userService.js
      stores/UseStore.js
      components/
        LandingPage.vue
        LoginView.vue
        LoginDeletePage.vue
        Register/
          Register_User.vue
          SendEmail.vue
```

## 🌟 Características

- ✅ **Autenticación segura** con correos escolares
- ✅ **Gestión de sesiones** segura y persistente
- ✅ **Frontend moderno** con Vue.js 3 y Vite
- ✅ **Backend robusto** con Express.js
- ✅ **Seguridad mejorada** con Helmet
- ✅ **CORS habilitado** para solicitudes seguras
- ✅ **Linting y formateo de código** con ESLint y Prettier
- ✅ **Herramientas de desarrollo** con npm-run-all y Vite

## 📋 Tabla de Contenidos

- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Cómo Usar](#cómo-usar)
- [API Endpoints](#api-endpoints)
- [Configuración](#configuración)
- [Scripts Disponibles](#scripts-disponibles)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Contribución](#contribución)
- [Licencia](#licencia)

## 🔧 Requisitos Previos

Antes de empezar, asegúrate de tener instalados:

- **Node.js** (v18 o superior)
- **pnpm** (gestor de paquetes recomendado)
- **Git** (para clonar el repositorio)

Para instalar pnpm globalmente:

```bash
npm install -g pnpm
```

## 📦 Instalación

### 1. Clonar el repositorio

```bash
git clone <tu-repositorio>
cd Login-Sesion-with-email-school-
```

### 2. Instalar dependencias del Backend

```bash
cd Backend
pnpm install
```

### 3. Instalar dependencias del Frontend

```bash
cd ../Frontend
pnpm install
```

### 4. Configurar variables de entorno

En la carpeta `Backend`, crea un archivo `.env`:

```env
# Servidor
PORT=3000
NODE_ENV=development

# Base de datos (si es necesario)
DATABASE_URL=

# Email (si es necesario)
SMTP_HOST=
SMTP_PORT=

# JWT (si es necesario)
JWT_SECRET=
```

## 🚀 Cómo Usar

### Ejecutar en desarrollo

**Terminal 1 - Backend:**

```bash
cd Backend
pnpm run dev
```

El servidor estará disponible en `http://localhost:3000`

**Terminal 2 - Frontend:**

```bash
cd Frontend
pnpm run dev
```

La aplicación estará disponible en `http://localhost:5173`

### Compilar para producción

**Backend:**

```bash
cd Backend
npm run build  # Si tienes este script configurado
```

**Frontend:**

```bash
cd Frontend
pnpm run build
```

## 📁 Estructura del Proyecto

```
Login-Sesion-with-email-school-/
├── Backend/                    # API REST con Express
│   ├── app.js                 # Configuración principal
│   ├── server.js              # Inicio del servidor
│   ├── package.json           # Dependencias del backend
│   ├── Model/                 # Modelos de datos
│   │   └── User.js           # Modelo de usuario
│   └── routes/                # Rutas de la API
│       └── index.js          # Rutas principales
│
├── Frontend/                   # Aplicación Vue.js
│   ├── src/
│   │   ├── App.vue           # Componente raíz
│   │   ├── main.js           # Punto de entrada
│   │   ├── assets/           # Estilos y assets
│   │   ├── components/       # Componentes reutilizables
│   │   │   ├── LoginView.vue # Componente de login
│   │   │   └── icons/        # Iconos
│   │   └── router/           # Configuración de rutas
│   ├── index.html            # HTML principal
│   ├── vite.config.js        # Configuración de Vite
│   └── package.json          # Dependencias del frontend
│
└── README.md                  # Este archivo
```

## 🔗 API Endpoints

### Rutas Base

| Método | Ruta    | Descripción           |
| ------ | ------- | --------------------- |
| GET    | `/`     | Mensaje de bienvenida |
| GET    | `/test` | Ruta de prueba        |

**Ejemplo de respuesta:**

```json
{
  "message": "Hello from routes!"
}
```

> ℹ️ Se recomienda expandir estos endpoints con funcionalidades de autenticación, registro, login, etc.

## ⚙️ Configuración

### Backend - Middlewares Habilitados

- **Helmet**: Seguridad HTTP mejorada
- **CORS**: Control de recursos compartidos entre orígenes
- **Morgan**: Logging de solicitudes HTTP
- **Express JSON**: Parseo automático de JSON

### Frontend - Herramientas

- **Vite**: Bundler y servidor de desarrollo rápido
- **Vue Router**: Enrutamiento de SPA
- **ESLint**: Linting de código
- **Prettier**: Formateador de código
- **Oxlint**: Linter moderno y rápido

## 📜 Scripts Disponibles

### Backend

```bash
pnpm run dev      # Inicia servidor con nodemon (auto-recarga)
pnpm run test     # Ejecuta tests
```

### Frontend

```bash
pnpm run dev      # Inicia servidor de desarrollo (puerto 5173)
pnpm run build    # Compila para producción
pnpm run preview  # Visualiza compilación de producción
pnpm run lint     # Ejecuta todos los linters
pnpm run format   # Formatea código con Prettier
```

## 🛠️ Tecnologías Utilizadas

### Frontend

- **Vue.js 3**: Framework progresivo de JavaScript
- **Vite**: Constructor de módulos moderno
- **Vue Router**: Enrutamiento oficial para Vue.js
- **ESLint**: Linter estático
- **Prettier**: Formateador de código

### Backend

- **Express.js**: Framework web minimalista
- **Node.js**: Entorno de ejecución JavaScript
- **Helmet**: Seguridad HTTP
- **CORS**: Middleware para CORS
- **Morgan**: Logger de solicitudes HTTP
- **Nodemon**: Reinicio automático en desarrollo
- **Dotenv**: Gestión de variables de entorno

## 👥 Contribución

Las contribuciones son bienvenidas. Para contribuir:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia ISC - Consulta el archivo LICENSE para más detalles.

---

**Creado con ❤️ para la comunidad educativa**
