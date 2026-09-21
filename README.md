# Mebel Sayti

Furniture company REST API built with Spring Boot.

## About the Project

Mebel Sayti is a backend REST API for a furniture company website.

The project provides:

* Product management
* Service management
* Contact message management
* Admin authentication
* JWT-based authorization
* Input validation
* Global exception handling
* Swagger API documentation

## Technologies

* Java 21
* Spring Boot
* Spring Security
* Spring Data JPA
* PostgreSQL
* JWT
* Lombok
* Maven
* Swagger / OpenAPI

## Project Structure

The project follows a layered architecture:

```text
Controller
    ↓
Service
    ↓
Repository
    ↓
Database
```

DTOs and Mappers are used to separate API data from database entities.

## Authentication

The application uses JWT authentication for admin users.

Login:

```http
POST /auth/login
```

After successful login, the API returns a JWT token.

Protected endpoints require:

```http
Authorization: Bearer <JWT_TOKEN>
```

## Main API Endpoints

### Products

| Method | Endpoint         | Access |
| ------ | ---------------- | ------ |
| GET    | `/products`      | Public |
| GET    | `/products/{id}` | Public |
| POST   | `/products`      | Admin  |
| PUT    | `/products/{id}` | Admin  |
| DELETE | `/products/{id}` | Admin  |

### Services

| Method | Endpoint         | Access |
| ------ | ---------------- | ------ |
| GET    | `/services`      | Public |
| GET    | `/services/{id}` | Public |
| POST   | `/services`      | Admin  |
| PUT    | `/services/{id}` | Admin  |
| DELETE | `/services/{id}` | Admin  |

### Contact Messages

| Method | Endpoint        | Access |
| ------ | --------------- | ------ |
| POST   | `/message`      | Public |
| GET    | `/message`      | Admin  |
| GET    | `/message/{id}` | Admin  |
| DELETE | `/message/{id}` | Admin  |

### Authentication

```http
POST /auth/login
```

### Admin

```http
POST /admin
```

Admin creation requires an authenticated admin account.

## Environment Variables

Sensitive configuration is not stored directly in the source code.

The application expects these environment variables:

```text
DB_USERNAME
DB_PASSWORD
JWT_SECRET
```

Example IntelliJ Run Configuration:

```text
DB_USERNAME=postgres
DB_PASSWORD=your_database_password
JWT_SECRET=your_long_jwt_secret
```

## Database

The project uses PostgreSQL.

Default database configuration:

```text
Database: mebel_sayti
Host: localhost
Port: 5432
```

## Running the Project

1. Install Java 21.
2. Install PostgreSQL.
3. Create the `mebel_sayti` database.
4. Configure the required environment variables.
5. Run the Spring Boot application.

The API will be available at:

```text
http://localhost:8080
```

## Swagger

API documentation is available through Swagger UI:

```text
http://localhost:8080/swagger-ui/index.html
```

Swagger can be used to test both public and authenticated endpoints.

## Error Handling

The application includes global exception handling for:

* Validation errors
* Resource not found
* Duplicate usernames
* Invalid login credentials

Errors are returned as structured JSON responses.

## Project Status

Backend development is complete.

Frontend development will be implemented separately using HTML, CSS and JavaScript.
