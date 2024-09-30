# Employee Tracker

## Table of content
[Description](#description)\
[Usage](#usage)\
[Installation](#installation)\

## Description
Employee Tracker is a command-line application built using Node.js, Inquirer, and PostgreSQL. It allows business owners to manage their company's employee database, including departments, roles, and employees. The application provides an intuitive and interactive interface to perform various operations on the database, such as viewing, adding, and updating employees, roles, and departments.

## Usage
Start the application by running:
node index.js

Use the interactive menu to:
View all departments
View all roles
View all employees
Add a department
Add a role
Add an employee
Update an employee's role
Exit the application

## Installation
Clone the repository to your local machine.
git clone <repository-url>

Install the required dependencies by running:
npm install

Install PostgreSQL and set up a local database. You can use pgAdmin to manage the database.

Run the SQL file provided (schema.sql and seeds.sql) to set up the database tables and seed data.

Set up your .env file with your PostgreSQL credentials:

DB_USER=<your-username>
DB_PASSWORD=<your-password>
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=employee_tracker

Ensure you are using Inquirer 8.2.4:
npm install inquirer@8.2.4
