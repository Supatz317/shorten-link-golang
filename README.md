# Shorten Link Golang

This repository is a URL shortening service built using Golang for the backend and a modern frontend framework. It allows users to shorten long URLs into compact links for easier sharing and tracking.

## Features
- URL shortening service
- Database integration for storing links
- Frontend for user interaction
- Dockerized database setup

## Prerequisites
To run this project, ensure you have the following installed:

- [Go](https://golang.org/dl/) (version 1.16 or later)
- [Node.js](https://nodejs.org/) (for the frontend)
- [Docker](https://www.docker.com/) (for the database)

## Setup Instructions

### Database
1. Navigate to the `database` folder:
   ```bash
   cd database
   ```
2. Start the database using Docker:
    ```bash
    docker-compose up
    ```
    If you encounter any errors, ensure that Docker Desktop is running. Restart Docker Desktop if necessary, and then try running the above command again.

### Backend
1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   go mod tidy
   ```
3. Run the backend server:
   ```bash
   go run .
   ```



### Frontend
1. Navigate to the `frontend-2` folder:
   ```bash
   cd frontend-2
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Usage
1. Start the backend server, database, and frontend as described above.
2. Open the frontend in your browser (usually at `http://localhost:3000`).
3. Use the interface to shorten URLs and manage them.

## Folder Structure
- `backend/`: Contains the Golang backend code.
- `database/`: Contains the database setup and configuration.
- `frontend-2/`: Contains the frontend code.



<!-- ## License
This project is licensed under the MIT License. -->