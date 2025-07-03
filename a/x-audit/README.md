# X-Audit: Audit Management for X Bank

This is a Next.js application built with Firebase Studio, designed for audit management.

## Running Locally in Visual Studio Code

To run this application on your local machine using VS Code, please follow these steps.

### 1. Prerequisites

Ensure you have the following installed on your system:

-   [Node.js](https://nodejs.org/en) (v18 or later)
-   [npm](https://www.npmjs.com/) (which comes with Node.js)
-   [PostgreSQL](https://www.postgresql.org/download/). A simple way to run it locally is with [Docker](https://www.docker.com/).

### 2. Initial Setup

1.  **Clone the Repository**: Open the project folder in VS Code.

2.  **Install Dependencies**: Open the integrated terminal in VS Code (`Ctrl+` or `Cmd+`\`) and run:
    ```bash
    npm install
    ```

3.  **Set Up Environment Variables**:
    - Create a `.env` file in the root of the project by copying the example:
      ```bash
      cp .env.example .env
      ```
    - Open your new `.env` file and update the `DATABASE_URL` with your PostgreSQL connection string. The format is `postgresql://USER:PASSWORD@HOST:PORT/DATABASE`. For a standard local setup, it might look like this:
      ```
      DATABASE_URL="postgresql://postgres:password@localhost:5432/x-audit"
      ```
    - The `SESSION_SECRET` is already filled with a secure value for local development.
    - To use the AI features (like Risk Assessment), get a free API key from [Google AI Studio](https://aistudio.google.com/app/apikey) and add it to `.env`:
      ```
      GOOGLE_API_KEY="YOUR_GOOGLE_API_KEY"
      ```

### 3. Database Setup

With your `.env` file configured, set up the database:

1.  **Run Database Migrations**: This command creates all the tables your app needs.
    ```bash
    npm run db:migrate:dev
    ```
    When prompted, enter a name for the migration (e.g., `initial-setup`).

2.  **Seed the Database**: This populates your database with sample users and data so you can log in.
    ```bash
    npm run db:seed
    ```

### 4. Running the Application

The application has two parts that need to run at the same time: the main web server and the AI server.

**Open two separate terminals in VS Code.**

-   **In Terminal 1 (Web App):**
    ```bash
    npm run dev
    ```

-   **In Terminal 2 (AI Server):**
    ```bash
    npm run genkit:watch
    ```

Once both servers show they are running, open your browser and go to **`http://localhost:9002`**.

You can now log in with the seeded users:
-   **Admin:** `admin@xbank.com`
-   **Auditor:** `auditor@xbank.com`
-   **Manager:** `manager@xbank.com`

The password for all users is `password123`.
