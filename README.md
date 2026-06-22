# Node.js MySQL Products API

This project is a simple REST API built with Node.js, Express, and MySQL. It manages users and products, stores the data in a MySQL database, and can be run locally with Docker Compose.

## What This Project Does

- Creates and connects to a MySQL database.
- Automatically creates the required `users` and `products` tables if they do not exist.
- Provides API endpoints for creating and listing users.
- Provides API endpoints for creating and listing products.
- Links each product to a user using `user_id`.
- Includes phpMyAdmin for browsing and managing the database from the browser.

## Technologies Used

- Node.js
- Express.js
- MySQL
- mysql2/promise
- Docker
- Docker Compose
- phpMyAdmin

## Project Structure

```text
DB/
  init_db.js
  check_db.js
  models/
    connection.js
modules/
  Users/
    user.controller.js
    user.routes.js
  products/
    product.controller.js
    product.routes.js
index.js
docker-compose.yml
Dockerfile
```

## API Endpoints

### Users

```http
GET /users
```

Returns all users. You can filter by name using:

```http
GET /users?letters=ah
```

```http
POST /users
```

Example request body:

```json
{
  "name": "Ahmed",
  "email": "ahmed@example.com",
  "password": "123456"
}
```

### Products

```http
GET /products
```

Returns all products. You can filter by title using:

```http
GET /products?letters=first
```

```http
POST /products
```

Example request body:

```json
{
  "title": "First Product",
  "content": "This is the first product description",
  "user_id": 1
}
```

## Run With Docker

Start the project:

```bash
docker compose up -d --build
```

The services will be available at:

- API: `http://localhost:3000`
- phpMyAdmin: `http://localhost:8080`
- MySQL: `localhost:3307`

phpMyAdmin login:

```text
Server: db
Username: user
Password: userpassword
Database: users
```

## Environment Variables

The app uses these environment variables:

```text
MYSQL_HOST=db
MYSQL_PORT=3306
MYSQL_USER=user
MYSQL_PASSWORD=userpassword
MYSQL_DATABASE=users
```

When connecting from the host machine to the Docker MySQL container, use port `3307`.

## Run Locally Without Docker

Install dependencies:

```bash
npm install
```

Start the app:

```bash
npm start
```

Make sure MySQL is running and the environment variables match your local database settings.
