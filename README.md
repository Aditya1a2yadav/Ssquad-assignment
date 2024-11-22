# RESTful API for Plans Management

## Overview

This project is a RESTful API developed using Node.js, Express.js, and MySQL. It supports a mobile or web application to handle CRUD (Create, Read, Update, Delete) operations on user plans, such as creating new plans, listing available plans, updating existing ones, and deleting them. The API also includes authentication using an `admin` table for user data management.

## Database

The API uses a MySQL database named `Ssquad`. It consists of two tables:

### `admin` Table

### `plans` Table

This table stores information about each plan created by users.

| Column        | Type          | Description               |
| ------------- | ------------- | ------------------------- |
| `plan_id`     | VARCHAR(36)   | Unique identifier for each plan (UUID) |
| `title`       | VARCHAR(255)  | Title of the plan          |
| `location`    | VARCHAR(255)  | Location of the plan       |
| `category`    | VARCHAR(100)  | Category of the plan       |
| `date`        | DATE          | Date of the plan           |
| `time`        | TIME          | Time of the plan           |
| `description` | TEXT          | Description of the plan    |
| `created_by`  | VARCHAR(255)  | User or admin who created the plan |
| `created_at`  | TIMESTAMP     | Timestamp when the plan was created |
| `status`      | VARCHAR(20)   | Status of the plan (default: 'open') |

## Setup

### Prerequisites

- **Node.js**: Ensure you have Node.js installed.
- **MySQL**: Install and configure MySQL.

### Installation

1. **Clone the repository**:
   ```bash
   git clone <your-repository-url>
   cd <repository-name>
