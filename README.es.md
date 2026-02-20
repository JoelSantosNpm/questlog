# QuestLog - Gestor de Campañas RPG

[🇺🇸 English](README.md) | [🇪🇸 Español](README.es.md)

**QuestLog** es una aplicación web integral, de alto rendimiento y estética Grimdark, diseñada para que Dungeon Masters y jugadores gestionen sus campañas de Dungeons & Dragons (5e).

Ofrece una interfaz inmersiva, rápida y reactiva para manejar todos los aspectos complejos de una campaña: seguimiento del progreso narrativo, control de inventarios, bibliotecas de monstruos y gestión de combates en tiempo real.

> **Nota:** Este proyecto está en desarrollo activo. Para ver el estado actual, consulta [PROJECT_STATE.md](PROJECT_STATE.md).

## 🚀 Características Principales

### 1. El Portal (Gestión de Campañas)

- **Interfaz 3D Inmersiva**: Carrusel circular con efecto de perspectiva para navegar entre campañas.
- **Creación Rápida**: Plantillas predefinidas para nuevas aventuras.

### 2. El Cronicón (Notas de Sesión)

- **Bitácora Cronológica**: Registra eventos clave, NPCs y pistas.
- **Búsqueda Inteligente**: Encuentra rápidamente detalles olvidados.

### 3. El Almacén (Inventario)

- **Control de Botín**: Gestión de objetos, pesos, rarezas y cantidades.
- **Reparto de Tesoro**: Herramientas para dividir el oro y objetos entre el grupo.

### 4. El Coliseo (Combate y Bestiario)

- **Biblioteca de Monstruos**: Estadísticas completas (CR, CA, PV, Acciones).
- **Rastreador de Iniciativa**: Gestión de turnos, puntos de vida y estados en tiempo real.

## 🛠 Stack Tecnológico

La arquitectura está diseñada para **rendimiento, escalabilidad y mantenibilidad**.

- **Frontend**:
  - [Next.js 16](https://nextjs.org/) (App Router, Server Components)
  - [React 19](https://react.dev/)
  - [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
  - [Tailwind CSS v4](https://tailwindcss.com/) (Estilos utilitarios)
  - [Framer Motion](https://www.framer.com/motion/) (Animaciones complejas)
  - [Lucide React](https://lucide.dev/) (Iconografía)

- **Backend & Datos**:
  - [PostgreSQL](https://www.postgresql.org/) (Base de datos relacional)
  - [Prisma ORM](https://www.prisma.io/) (Acceso a datos Type-safe)
  - [Supabase](https://supabase.com/) (Infraestructura DB)
  - [Zustand](https://github.com/pmndrs/zustand) (Gestión de estado ligero)

- **Calidad de Código**:
  - [Jest](https://jestjs.io/) + Testing Library (Tests unitarios)
  - ESLint + Prettier (Linting y formato)

## 📦 Instalación y Desarrollo

### Requisitos Previos

- [Node.js](https://nodejs.org/) (v18 o superior)
- [npm](https://www.npmjs.com/)

### Pasos para Ejecutar

1. **Clonar el repositorio:**

   ```bash
   git clone https://github.com/JoelSantosNpm/questlog.git
   cd questlog
   ```

2. **Instalar dependencias:**

   ```bash
   npm install
   ```

3. **Configurar Variables de Entorno:**
   Crea un archivo `.env` en la raíz basado en el ejemplo (necesitarás una URL de conexión a PostgreSQL):

   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/questlog"
   ```

4. **Inicializar Base de Datos:**

   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

5. **Lanzar Servidor de Desarrollo:**
   ```bash
   npm run dev
   ```
   Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 🧪 Testing

El proyecto cuenta con una suite de tests unitarios configurada con Jest.

```bash
# Ejecutar tests
npm test

# Ejecutar tests en modo watch
npm test -- --watch
```

## 🤝 Contribución

¡Las contribuciones son bienvenidas! Por favor, lee nuestras guías de contribución antes de enviar un Pull Request.

---

&copy; 2026 Questlog System. Licensed under MIT.

Crea un archivo `.env` en el directorio raíz basado en `.env.example`.

```bash
cp .env.example .env
```

Rellena las cadenas de conexión a tu base de datos en `.env`:

```env
# Conexión a Supabase vía connection pooling
DATABASE_URL="postgresql://usuario:contraseña@host:puerto/base_de_datos?pgbouncer=true"

# Conexión directa a la base de datos. Usado para migraciones
DIRECT_URL="postgresql://usuario:contraseña@host:puerto/base_de_datos"
```

4. **Configuración de la Base de Datos:**
   Ejecuta las migraciones de Prisma para crear el esquema de la base de datos.

   ```bash
   npx prisma migrate dev
   ```

5. **Ejecutar el servidor de desarrollo:**

   ```bash
   npm run dev
   ```

6. **Abrir la aplicación:**
   Navega a [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📂 Estructura del Proyecto

Aquí tienes un resumen de los directorios clave:

- `src/app/`: Rutas y páginas de la aplicación (Next.js App Router).
- `src/actions/`: Server Actions para manejar envíos de formularios y mutaciones.
- `src/lib/`: Funciones de utilidad y configuración compartida (ej. cliente Prisma).
- `prisma/`: Esquema de la base de datos (`schema.prisma`) y archivos de migración.
- `public/`: Activos estáticos como imágenes y fuentes.

## 📜 Scripts

- `npm run dev`: Inicia el servidor de desarrollo.
- `npm run build`: Construye la aplicación para producción.
- `npm run start`: Inicia el servidor de producción.
- `npm run lint`: Ejecuta ESLint para comprobar problemas de calidad del código.

## 🔒 Proyecto Privado

Este es un proyecto privado. No está abierto a contribuciones en este momento.
Todos los derechos reservados.
