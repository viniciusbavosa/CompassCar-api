# AWS Node MAR25 - Car Management API

## API for Compass Car to manage vehicles with CRUD and validation

## Features

- Register new cars
- Update car information
- Soft-delete cars
- List all available cars (with pagination)
- Search for cars by query
- Field validation (e.g., license plate, year, etc.)

---

## 🛠️ Tech Stack

- Node.js
- Express
- sequelize
- mysql
- dotenv

---

## 📦 Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/ANMAR25_D01_COMPASSCAR.git
   cd aws-node-mar25-car-api
   ```

2. **Install dependencies**

   ```bash
    npm install
   ```

3. **Database setup**

   This project uses **MySQL** as the relational database and **Sequelize** as the ORM (Object Relational Mapper).

   With MySQL Server running, create a new database before running the application

   ```sql
    CREATE DATABASE compasscar
   ```

   You must have MySQL installed and running on your machine before starting the project.

4. **Environment setup**

   Create a `.env` file in the root of your project as shown in `.env-example`

   ```
       PORT=your_server_port

       DB_NAME=your_database_name
       DB_USER=your_database_user
       DB_PASSWORD=your_database_password
       DB_DIALECT=mysql
       DB_HOST=localhost
   ```

   If database credentials are not provided, the following will be used

   ```
     PORT=3000

     DB_NAME=compasscar
     DB_USER=root
     DB_PASSWORD=123
     DB_DIALECT=mysql
     DB_HOST=localhost
   ```

5. **Run the application**

   To make sure everything is running as expected, run the command

   ```bash
   npm run test
   ```

   To start the server, run the command

   ```bash
   npm run server
   ```

# API Documentation

## Base URL

```
http://localhost:your_server_port/api/v1
```

## [POST] /cars

Creates a new car

### Body

```json
{ "brand": "Marca", "model": "Modelo", "year": 2018, "plate": "ABC-1D23" }
```

### Responses

- `201 Created`: Returns the created car information
- `400 Bad Request`: If validation fails, returns an object with errors messages
- `409 Conflict`: Car already exists

## [GET] /cars

Retrieves a paginated list of cars.
Accepts optional query parameters for filtering and pagination:

- `page` (number): The page number (default: 1)
- `limit` (number): Maximum number of items per page (default: 5)
- `year` (number): Filter by car year
- `final_plate` (number): Filter by the last digit of the license plate (0-9)
- `brand` (string): Filter by brand name (partial match allowed)

### Responses

- `200 OK`: Returns the paginated list of cars

## [GET] /cars/:id

Retrieves a specific car.

### Responses

- `200 OK`: Returns car information
- `404 Not Found`: The requested resource could not be found on the server

## [PUT] /cars/:id/items

Creates a new item or update an existing one if already exists

### Body

```json
["Ar condicionado", "Trava Eletrica", "Vidro Eletrico"]
```

### Responses

- `204 No Content`: No body is returned
- `404 Not Found`: The requested resource could not be found on the server
- `400 Bad Request`: If validation fails, returns an object with errors messages

## [PUT] /cars/:id/

Update a specific car information

### Body (All fields are optional)

```json
{ "brand": "Fiat", "model": "Uno", "year": "2022", "plate": "ABC-1D23" }
```

### Responses

- `204 No Content`: No body is returned
- `404 Not Found`: The requested resource could not be found on the server
- `400 Bad Request`: If validation fails, returns an object with errors messages
- `409 Conflict`: Car already exists with same plate

## [DELETE] /cars/:id/

Delete a car and its items from the server

### Responses

- `204 No Content`: No body is returned
- `404 Not Found`: The requested resource could not be found on the server
