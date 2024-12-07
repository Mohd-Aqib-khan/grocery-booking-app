
# Grocery-Booking-App

A robust and scalable application for managing groceries and orders. This app is built using Node.js and TypeScript, with a PostgreSQL database, and is fully containerized using Docker.




## Features

- Manage grocery items and inventory.
- Book and manage orders with automatic stock updates.
- RESTful API design for smooth integration.
- Fully containerized with Docker for easy deployment.


## Prerequisites
To run this project, ensure you have the following installed:
- Docker (v20.10+)
- Docker Compose (v1.29+)
- Project Structure

## Project Directory Structure
```
.
├── db-scripts/               # Initialization SQL
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
```
## Roadmap

- Additional browser support

- Add more integrations


## Installation

1. Clone the repository

```bash
  git clone https://github.com/Mohd-Aqib-khan/grocery-booking-app.git
  cd grocery-booking-app
```
2. Build and Run with Docker
Ensure you are in the project directory. Then, execute the following commands:
Build and Start Containers
```bash
  sudo docker-compose up --build
```
Stop Containers
```bash
  sudo docker-compose down -v
```

3. Access the App
App: http://localhost:3000
PostgreSQL: Exposed on port 5434 (local access).
## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`DB_HOST` = `db`

`DB_PORT` = `5432`

`DB_NAME` = `grocery-bank`

`DB_USER` = `postgres`

`DB_PASSWORD` = `hrhk`

`PORT` = `3000`

`JWT_SECRET` = `GENERATE_YOUR_OWN_KEY`

`JWT_EXPIRES_IN` = `1d`


## Future Enhancements
- Implement a user-friendly front-end interface.
- Add unit and integration tests.

Feel free to contribute or raise issues! 😊