# Contacts Backend API

This project is a Node.js/Express REST API for managing personal contacts. It provides user authentication and CRUD operations for contacts, using MongoDB (via TypeORM) for persistent storage. The app includes security middleware, error handling, rate limiting, and Swagger documentation.

## Features

- User registration & authentication (JWT-based)
- Create, read, update, and delete contacts linked to the authenticated user
- Rate limiting and error handling middleware
- API documentation with Swagger UI
- Docker setup for easy deployment and development

## Endpoints

### User Endpoints
- `POST /api/users/register` – Register a new user (username, email, password)
- `POST /api/users/login` – Login with email and password, get an access token
- `GET /api/users/current` – Get details of the current authenticated user (requires token)

### Contacts Endpoints (protected)
- `GET /api/contacts` – Fetch all contacts for the logged-in user
- `POST /api/contacts` – Create a new contact (name, email, phone)
- `GET /api/contacts/:id` – Fetch a specific contact by ID
- `PUT /api/contacts/:id` – Update an existing contact
- `DELETE /api/contacts/:id` – Delete a contact

## How to Run Locally

1. **Install dependencies:**
npm install

2. **Set environment variables:**
- Copy `.env.example` to `.env` and fill in required settings (e.g., CONNECTION_STRING, ACCESS_TOKEN_SECRET).

3. **Start MongoDB and Redis (via Docker):**
make secondary-only

This will launch only the MongoDB database and Redis services for local development.

4. **Run the server:**
npm run dev

5. **Access API:**
- Base URL: `http://localhost:5002/`
- Documentation: `http://localhost:5002/api-docs`

## How to Run Fully in Docker

1. **Build and start all services:**
make up

2. **Stop all services:**
make down

## Security and Usage

- All contact endpoints require a valid JWT token.
- Every contact is strictly linked to the authenticated user; permissions checks prevent access/modification of others' data.
- Error and edge cases (missing parameters, wrong permissions, invalid IDs) return informative HTTP status codes.

### Author
Teo Bonza