# Project Name

## Overview

This project is a **Mini Blog Application** built using Symfony as the backend and React for the frontend. It provides a simple platform to manage blog posts, offering basic CRUD (Create, Read, Update, Delete) functionality. The backend serves a RESTful API, and the frontend interacts with the API to display and manage blog posts. The project uses MySQL for data storage and Webpack Encore for integrating React into Symfony.

## Features

- **Post List View:** Displays a paginated list of blog posts.
- **Post Detail View:** Shows information about individual posts.
- **CRUD Operations:** Allows creating, reading, updating, and deleting blog posts.
- **Pagination:** Supports paginated post listing.
- **Responsive Design:** Ensures the application works well on both desktop and mobile devices.
- **Error Handling:** Handles loading and error states gracefully.
- **Authentication:** Includes a basic authentication system.

## Table of Contents

- [Usage](#usage)
- [Installation](#installation)
  - [Prerequisites](#prerequisites)
  - [Backend (Symfony)](#backend-symfony)
  - [Frontend (React)](#frontend-react)
  - [Running the Application](#running-the-application)
- [Author](#author)
- [License](#license)

## Usage

- Navigate to the homepage to see the list of blog posts.
- Click on individual posts to view their details.
- Use the provided buttons to create, edit, or delete posts.
- The application automatically handles pagination for large numbers of posts.

## Installation

### Prerequisites

Ensure you have the following installed:

- PHP 8.2
- Composer 2.x
- Node.js 18.x and npm 8.x
- Symfony CLI 7.1
- MySQL 8

### Backend (Symfony)

1. **Clone the repository:**

   ```bash
   git clone https://github.com/TsikaAndreas/symfony-blog-project.git
   cd symfony-blog-project
   ```

2. **Install PHP dependencies:**

   ```bash
   composer install
   ```

3. **Set up environment variables:**
   Copy the `.env.example` file to `.env` **if it doesn't exists**, and adjust the configuration as needed.

   ```bash
   cp .env.example .env
   # Edit DATABASE_URL in .env.local to match your MySQL credentials
   ```

4. **Set up the database:**
   Make sure your database is configured in the `.env` file, then run:

   ```bash
   php bin/console doctrine:database:create
   php bin/console doctrine:migrations:migrate
   ```

5. **Load fixtures:**
   ```bash
   php bin/console doctrine:fixtures:load
   ```
   > **_NOTE:_** To run the command above, the `APP_ENV` inside the `.env` file must be set to `dev` instead of `production`. This is because fixtures should only be loaded in a development environment. After loading the fixtures, you can set the `APP_ENV` back to `production`.

### Frontend (React)

1. **Install JavaScript dependencies:**

   ```bash
   npm install
   ```

2. **Build assets:**
   ```bash
   npm run build
   ```

### Running the Application

1. **Start the Symfony server:**
   ```bash
   symfony server:start
   ```

## Author

This project was created by Andrei-Robert Tsika. You can find me on:

- **Github:** [TsikaAndreas](https://github.com/TsikaAndreas)
- **LinkedIn:** [tsika](https://www.linkedin.com/in/tsika/)

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE.md) file for more details.
