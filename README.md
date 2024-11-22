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

# Testing the Ssquad API with Postman

 Step 1: Import the Postman Collection
 -------------------------------------
 1. Open Postman.
 2. Click on the "Import" button in the top-left corner.
 3. Use one of the following methods to import the collection:
    a) Drag and drop the file `Ssquad.postman_collection.json` into the Import modal.
    b) Select the file manually:
       - Click "Upload Files"
       - Browse to `Ssquad.postman_collection.json`
 4. Once imported, you will see a collection named "Ssquad API Collection" in the sidebar.

 Step 2: Create a New Environment
 --------------------------------
 1. Open the "Environments" tab in Postman.
 2. Click "Add New Environment".
 3. Name the environment: Ssquad Environment.
 4. Add a variable:
    - Variable Name: base_url
    - Initial Value: http://localhost:3000
 5. Save the environment.
 6. Select "Ssquad Environment" from the dropdown in the top-right corner of Postman.

 Step 3: Test the Endpoints
 --------------------------
 Use the imported collection to test the API.
 Replace placeholder values (e.g., :id) in the endpoints with actual data when testing.

 Endpoint Summary
 ----------------

 1. Authentication
 Login:
 - Method: POST
 - Endpoint: {{base_url}}/login
 - Body:
 {
   "username": "your_username",
   "password": "your_password"
 }

 2. Plans Management
 Create a New Plan:
 - Method: POST
 - Endpoint: {{base_url}}/plans
 - Body:
 {
   "title": "Plan Title",
   "location": "Location",
   "category": "Category",
   "date": "YYYY-MM-DD",
   "time": "HH:MM:SS",
   "description": "Description",
   "created_by": "Admin Username"
 }

 Retrieve All Plans:
 - Method: GET
 - Endpoint: {{base_url}}/plans

 Retrieve Specific Plan:
 - Method: GET
 - Endpoint: {{base_url}}/plans/:id

 Update a Plan:
 - Method: PATCH
 - Endpoint: {{base_url}}/plans/:id
 - Body:
 {
   "title": "Updated Title",
   "location": "Updated Location",
   "category": "Updated Category",
   "date": "YYYY-MM-DD",
   "time": "HH:MM:SS",
   "description": "Updated Description",
   "created_by": "Admin Username"
 }

 Delete a Plan:
 - Method: DELETE
 - Endpoint: {{base_url}}/plans/:id

 Filter Plans:
 - Method: GET
 - Endpoint: {{base_url}}/plans/filter
 - Query Parameters:
   - location (optional)
   - date (optional)
   - category (optional)
   - sort_by (optional): "time" or "date"
 Example:
   {{base_url}}/plans/filter?location=NewYork&date=2024-12-01&sort_by=date

 Note: The collection includes examples for all endpoints with proper request bodies and parameters.
