# QuestLog - Gestor de Campañas RPG

[🇺🇸 English](README.md) | [🇪🇸 Español](README.es.md)

QuestLog es una aplicación web integral diseñada para Dungeon Masters y jugadores para gestionar sus campañas de Dungeons & Dragons (5e). Proporciona herramientas para el seguimiento del progreso de la historia, inventario, monstruos y encuentros de combate.

Construido con tecnologías web modernas, ofrece una interfaz rápida y receptiva para manejar datos complejos de campañas.

## 🚀 Características

- **Gestión de Campañas**: Crea y organiza múltiples campañas en un solo lugar.
- **Notas de Sesión (El Cronicón)**: Registra notas detalladas de cada sesión de juego para seguir el hilo de la historia.
- **Sistema de Inventario (El Almacén)**: Gestiona el botín del grupo, objetos, rarezas y cantidades.
- **Bestiario y Rastreador de Combate (El Coliseo)**:
  - Mantén una biblioteca de monstruos con estadísticas (CR, CA, PV).
  - Rastrea encuentros de combate activos con iniciativa y estado de salud actual.

## 🛠 Tecnologías

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Biblioteca**: [React 19](https://react.dev/)
- **Base de Datos**: [PostgreSQL](https://www.postgresql.org/) (vía Supabase)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Estilos**: [Tailwind CSS](https://tailwindcss.com/)
- **Gestión de Estado**: [Zustand](https://github.com/pmndrs/zustand)
- **Iconos**: [Lucide React](https://lucide.dev/)

## 📦 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado lo siguiente:

- [Node.js](https://nodejs.org/) (v18 o superior)
- [npm](https://www.npmjs.com/) u otro gestor de paquetes

## 🏁 Primeros Pasos

1. **Clonar el repositorio:**

   ```bash
   git clone https://github.com/JoelSantosNpm/questlog.git
   cd questlog
   ```

2. **Instalar dependencias:**

   ```bash
   npm install
   ```

3. **Configuración del Entorno:**
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

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Por favor, siéntete libre de enviar un Pull Request.

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la [Licencia MIT](LICENSE).
