To-Do List Application
This is a monorepo project for a To-Do List application using the following technologies:

Frontend: Vue.js, Pinia, Vite, TypeScript

Backend: Node.js (with Fastify), PostgreSQL, TypeScript

Authentication: Firebase

Containerization: Docker (for both frontend, backend, and database)

Database: PostgreSQL

Schema: DBML file for schema definition

Deployment: Docker Compose for running frontend, backend, and PostgreSQL in containers

Features
User Interface
Login Screen: Allows users to log in using ID + Password, with the ability to create a new user.

Tasks List: Displays a list of existing tasks that are created by and shared with the user.

Task Filters: A dropdown filter to show:

All Tasks

My Tasks

Shared Tasks

Task Sharing: A popup to share a task with other users.

Backend APIs
User Authentication: Login/Signup flow, with user creation stored in PostgreSQL.

CRUD Operations for Tasks: APIs for creating, reading, updating, and deleting tasks.

Task Sharing: API for sharing tasks with other users.

Prerequisites
Before you begin, ensure you have the following installed:

Node.js (v16 or higher)

Docker and Docker Compose

PostgreSQL (if not using Docker)

Firebase Account (for authentication)