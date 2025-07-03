# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Running Locally in VS Code

To run this application on your local machine using Visual Studio Code, follow these steps.

### 1. Prerequisites

-   [Node.js](https://nodejs.org/en) (v18 or later)
-   [npm](https://www.npmjs.com/) (usually comes with Node.js)
-   [PostgreSQL](https://www.postgresql.org/download/) running locally or a connection string to a hosted instance. A simple way to run it locally is with [Docker](https://www.docker.com/).

### 2. Initial Setup

1.  **Clone the repository** and open it in VS Code.

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a new file named `.env` in the root of your project by copying the example file:
    ```bash
    cp .env.example .env
    ```
    Now, open your new `.env` file and update the `DATABASE_URL` with the connection string for your PostgreSQL database. The format is `postgresql://USER:PASSWORD@HOST:PORT/DATABASE`.

    The `SESSION_SECRET` is already filled with a secure random value, so you can leave it as is for local development. If you plan to deploy this application to production, you should generate a new unique secret.

    If you want to use the AI features, you will also need to add your `GOOGLE_API_KEY` to the `.env` file.

### 3. Database Setup

1.  **Run database migrations:** This will create all the necessary tables in your database based on the schema.
    ```bash
    npm run db:migrate:dev
    ```
    When prompted, give your migration a name (e.g., `init`).

2.  **Seed the database:** This will populate your database with initial data (like users and sample audits) so you can log in and use the app.
    ```bash
    npm run db:seed
    ```

### 4. Running the Application

This project has two parts that need to run at the same time: the Next.js web application and the Genkit AI server.

Open two terminals in VS Code and run the following commands:

-   **In Terminal 1 (Next.js App):**
    ```bash
    npm run dev
    ```

-   **In Terminal 2 (Genkit AI Server):**
    ```bash
    npm run genkit:watch
    ```

Once both servers are running, you can open your browser and navigate to `http://localhost:9002` to see the application.

You can now log in using the default credentials from the seed data (e.g., `auditor@xbank.com` with password `password123`).
