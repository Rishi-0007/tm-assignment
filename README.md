# Task Management System (Track A)

A full-stack task management application built with Express, TypeScript, Prisma, and Next.js.

## Tech Stack

- **Backend**: Node.js, Express, TypeScript, Prisma (ORM), PostgreSQL (Supabase)
- **Frontend**: Next.js 15, TypeScript, Tailwind CSS, shadcn/ui
- **Authentication**: JWT (Access & Refresh Tokens)

## Prerequisites

- Node.js (v18+)
- PostgreSQL Database (e.g., Supabase)

## Installation

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd tm-assignment
    ```

2.  **Backend Setup**:
    ```bash
    cd backend
    npm install
    
    # Create .env file based on .env.example
    cp .env.example .env
    # Update DATABASE_URL and secrets in .env
    
    # Run migrations
    npx prisma migrate dev
    
    # (Optional) Seed database with demo user
    npx prisma db seed
    
    # Start server
    npm run dev
    ```

3.  **Frontend Setup**:
    ```bash
    cd ../frontend
    npm install
    
    # Create .env.local file
    cp .env.example .env.local
    
    # Start development server
    npm run dev
    ```

## Database Schema

- **User**: `id`, `email`, `name`, `password` (hashed), `refreshToken`
- **Task**: `id`, `title`, `description`, `status` (pending/completed), `userId` (relation)

## API Endpoints

- **Auth**: `/auth/register`, `/auth/login`, `/auth/refresh`, `/auth/logout`
- **Tasks**: `/tasks` (GET, POST), `/tasks/:id` (GET, PATCH, DELETE), `/tasks/:id/toggle`

## Demo Credentials

If you ran the seed script:
- **Email**: `demo@example.com`
- **Password**: `password123`

## Usage for Assignment Submission

To build the project for production/submission:

1.  **Backend**:
    ```bash
    cd backend
    npm run build
    npm start
    ```

2.  **Frontend**:
    ```bash
    cd frontend
    npm run build
    npm start
    ```
