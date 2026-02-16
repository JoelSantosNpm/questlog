# QuestLog - RPG Campaign Manager

[🇺🇸 English](README.md) | [🇪🇸 Español](README.es.md)

QuestLog is a comprehensive web application designed for Dungeon Masters and players to manage their Dungeons & Dragons (5e) campaigns. It provides tools for tracking story progression, inventory, monsters, and combat encounters.

Built with modern web technologies, it offers a fast and responsive interface for managing complex campaign data.

## 🚀 Features

- **Campaign Management**: Create and organize multiple campaigns in one place.
- **Session Notes (El Cronicón)**: Record detailed notes for each game session to keep track of the story.
- **Inventory System (El Almacén)**: Manage party loot, items, rarities, and quantities.
- **Bestiary & Combat Tracker (El Coliseo)**:
  - Maintain a library of monsters with stats (CR, AC, HP).
  - Track active combat encounters with initiative and current health status.

## 🛠 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Library**: [React 19](https://react.dev/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) (via Supabase)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Icons**: [Lucide React](https://lucide.dev/)

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) or another package manager

## 🏁 Getting Started

1. **Clone the repository:**

   ```bash
   git clone https://github.com/JoelSantosNpm/questlog.git
   cd questlog
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create a `.env` file in the root directory based on `.env.example`.

   ```bash
   cp .env.example .env
   ```

   Fill in your database connection strings in `.env`:

   ```env
   # Connect to Supabase via connection pooling
   DATABASE_URL="postgresql://user:password@host:port/database?pgbouncer=true"

   # Direct connection to the database. Used for migrations
   DIRECT_URL="postgresql://user:password@host:port/database"
   ```

4. **Database Setup:**
   Run Prisma migrations to create the database schema.

   ```bash
   npx prisma migrate dev
   ```

5. **Run the development server:**

   ```bash
   npm run dev
   ```

6. **Open the app:**
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## 📂 Project Structure

Here's an overview of the key directories:

- `src/app/`: Application routes and pages (Next.js App Router).
- `src/actions/`: Server Actions for handling form submissions and mutations.
- `src/lib/`: Utility functions and shared configuration (e.g., Prisma client).
- `prisma/`: Database schema (`schema.prisma`) and migration files.
- `public/`: Static assets like images and fonts.

## 📜 Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the application for production.
- `npm run start`: Starts the production server.
- `npm run lint`: Runs ESLint to check for code quality issues.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
