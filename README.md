# RESTful API for Plans Management

## Overview

This project is a RESTful API developed using Node.js, Express.js, and MySQL. It supports a mobile or web application to handle CRUD (Create, Read, Update, Delete) operations on user plans, such as creating new plans, listing available plans, updating existing ones, and deleting them. The API also includes authentication using an `admin` table for user data management.

## Database

The API uses a MySQL database named `Ssquad`. It consists of two tables:

### `admin` Table

### `plans` Table

This table stores information about each plan created by users.

| Column        | Type         | Description                            |
| ------------- | ------------ | -------------------------------------- |
| `plan_id`     | VARCHAR(36)  | Unique identifier for each plan (UUID) |
| `title`       | VARCHAR(255) | Title of the plan                      |
| `location`    | VARCHAR(255) | Location of the plan                   |
| `category`    | VARCHAR(100) | Category of the plan                   |
| `date`        | DATE         | Date of the plan                       |
| `time`        | TIME         | Time of the plan                       |
| `description` | TEXT         | Description of the plan                |
| `created_by`  | VARCHAR(255) | User or admin who created the plan     |
| `created_at`  | TIMESTAMP    | Timestamp when the plan was created    |
| `status`      | VARCHAR(20)  | Status of the plan (default: 'open')   |

## Setup

### Prerequisites

- **Node.js**: Ensure you have Node.js installed.
- **MySQL**: Install and configure MySQL.

### Installation

1. **Clone the repository**:

   ```bash
   git clone <your-repository-url>
   cd <repository-name>
   ```

# API Endpoints

# User Authentication

POST /login

 Description: User login for admin authentication

# Plans Management

POST /plans

 Description: Create a new plan

 Request Body

 {

 "title": "Plan Title"

 "location": "Location"

 "category": "Category"

 "date": "YYYY-MM-DD"

 "time": "HH:MM:SS"

 "description": "Description"

# "created_by": "Admin Username"

 }

GET /plans

 Description: Retrieve all plans

GET /plans/:id

 Description: Retrieve a specific plan by plan_id

PATCH /plans/:id

 Description: Update a specific plan

 Request Body

 {

 "title": "Updated Title"

 "location": "Updated Location"

 "category": "Updated Category"

 "date": "YYYY-MM-DD"

 "time": "HH:MM:SS"

 "description": "Updated Description"

 "created_by": "Admin Username"

 }

DELETE /plans/:id

 Description: Delete a specific plan by plan_id

 Filtering Plans

GET /plans/filter

 Description: Filter plans based on criteria like location, date, or category

 Query Parameters

 location (optional)

 date (optional)

 category (optional)

 sort_by (optional): "time" or "date"

 Example

 GET /plans/filter?location=NewYork&date=2024-12-01&sort_by=date

# Project Structure

 /yourrepository

 |-- server.js # Main server file

 |-- package.json # Node.js dependencies

 |-- README.md # Project documentation

 |-- .env # Environment variables file

# Usage

 Create a Plan: Use the /plans POST endpoint with the required fields

 View Plans: Use the /plans GET endpoint to see all available plans

 Update a Plan: Use the /plans/:id PATCH endpoint

 Delete a Plan: Use the /plans/:id DELETE endpoint

 Filter Plans: Use the /plans/filter GET endpoint with query parameters

# Dependencies

 express: Web framework for Node.js

 mysql: MySQL database client for Node.js

 uuid: For generating unique IDs

 dotenv: For environment variable management

# Middleware

 bodyParser.json(): To parse incoming JSON requests

 Authentication Middleware: checkAuthenticated and checkNotAuthenticated to handle user sessions

# Authentication Middleware

# checkAuthenticated

 Used to ensure that a user is logged in before accessing a route

 function checkAuthenticated(req, res, next) {

 if (req.isAuthenticated()) {

 return next()

 }

 res.redirect('/login')

 }

 Use Case: Routes that require the user to be logged in, like creating or updating a plan

# checkNotAuthenticated

 Used to restrict access to routes when the user is already logged in

 function checkNotAuthenticated(req, res, next) {

 if (req.isAuthenticated()) {

 return res.redirect('/')

 }

 next()

 }

 Use Case: Routes like the login page that should only be accessible if the user is not logged in
