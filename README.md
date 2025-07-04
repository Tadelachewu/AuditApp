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
    -   Create a new file named `.env` in the root of your project.
    -   Open your new `.env` file and add the following variables:

    -   **Database URL**: Update this with your PostgreSQL connection string. For a standard local setup, it might look like this:
        ```
        DATABASE_URL="postgresql://postgres:password@localhost:5432/x-audit"
        ```

    -   **Session Secret**: Add a secure, random string for signing session cookies. You can generate one easily online or with a password manager.
        ```
        SESSION_SECRET="YOUR_SUPER_SECRET_RANDOM_STRING_HERE"
        ```

    -   **Google API Key**: To use the AI features (like Risk Assessment), get a free API key from [Google AI Studio](https://aistudio.google.com/app/apikey) and add it to `.env`:
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

---

## User Roles & Login Credentials

The application has three distinct user roles, each with different permissions. You can log in with the following seeded users to test each role. The password for all users is `password123`.

### 1. Admin

-   **Email:** `admin@xbank.com`
-   **Permissions:**
    -   Has full access to all features.
    -   Can schedule new audits and assign them to auditors.
    -   Can create, read, update, and delete all checklists and documents.
    -   Can view all reports.
    -   Can use the AI-Powered Risk Assessment tool.
    -   Can manage user profiles.

### 2. Auditor

-   **Email:** `auditor@xbank.com`
-   **Permissions:**
    -   The primary "doer" role for conducting audits.
    -   Can view all audits but can only manage audits assigned to them.
    -   Can create, read, update, and delete checklists and documents (evidence, policies, etc.).
    -   Can generate and view reports for their assigned audits.
    -   **Cannot** schedule new audits or access the Risk Assessment page.

### 3. Manager

-   **Email:** `manager@xbank.com`
-   **Permissions:**
    -   A read-only role designed for oversight and monitoring.
    -   Can view all audits, checklists, reports, and documents.
    -   **Cannot** create, edit, or delete any data. Buttons for actions like "Schedule New Audit", "Create Checklist", or "Upload Document" will be hidden.
    -   **Cannot** access the Risk Assessment page.
