Grocery Book App
A robust and scalable application for managing groceries and orders. This app is built using Node.js and TypeScript, with a PostgreSQL database, and is fully containerized using Docker.

Features
Manage grocery items and inventory.
Book and manage orders with automatic stock updates.
RESTful API design for smooth integration.
Fully containerized with Docker for easy deployment.
Prerequisites

To run this project, ensure you have the following installed:

Docker (v20.10+)
Docker Compose (v1.29+)
Project Structure

Copy code
.
├── db-scripts/               # Initialization SQL scripts for the database
├── src/                      # Source code
│   ├── controllers/          # API controllers
│   ├── db/                   # Database connection
│   ├── middleware/           # Authentication & role-check middleware
│   ├── models/               # Sequelize models
│   ├── routes/               # API routes
│   ├── services/             # Business logic
│   └── utils/                # Helper functions (e.g., JWT handling)
├── dist/                     # Compiled JavaScript files (auto-generated)
├── docker-compose.yml        # Docker Compose configuration
├── Dockerfile                # Dockerfile for the app
├── package.json              # Dependencies and scripts
├── tsconfig.json             # TypeScript configuration
└── README.md                 # Project documentation


Installation and Setup
1. Clone the repository
bash
Copy code
git clone https://github.com/your-repository/grocery-book-app.git
cd grocery-book-app
2. Build and Run with Docker
Ensure you are in the project directory. Then, execute the following commands:

Build and Start Containers
bash
Copy code
sudo docker-compose up --build
Stop Containers
bash
Copy code
sudo docker-compose down -v
3. Access the App
App: http://localhost:3000
PostgreSQL: Exposed on port 5434 (local access).
Environment Variables
The following environment variables are used in the application. These are set in docker-compose.yml.

Variable	Description	Example
DATABASE_URL	Connection string for PostgreSQL	postgres://postgres:1@db:5432/grocery-book
POSTGRES_USER	PostgreSQL user	postgres
POSTGRES_PASSWORD	PostgreSQL password	1
POSTGRES_DB	Database name	grocery-book
Troubleshooting
Common Issues
Error: ECONNREFUSED
If the app cannot connect to the database, ensure:

The database container is running.
The DATABASE_URL in the docker-compose.yml file matches the POSTGRES_USER, POSTGRES_PASSWORD, and POSTGRES_DB.
Database Scripts Not Running
Ensure:

SQL files in the db-scripts folder have correct permissions (chmod -R 755 ./db-scripts).
The volume mapping for db-scripts is correct in docker-compose.yml.

Future Enhancements
Add authentication with role-based access control.
Implement a user-friendly front-end interface.
Add unit and integration tests.

Feel free to contribute or raise issues! 😊