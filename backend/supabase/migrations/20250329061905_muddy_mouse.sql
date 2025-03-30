/*
  # Initial Schema Setup

  1. New Tables
    - users
      - id (UUID, primary key)
      - email (varchar, unique)
      - name (varchar)
      - created_at (timestamp)
    - tasks
      - id (UUID, primary key)
      - title (varchar)
      - description (text, optional)
      - status (enum: TODO, IN_PROGRESS, COMPLETED)
      - due_date (timestamp, optional)
      - created_at (timestamp)
      - updated_at (timestamp)
      - user_id (UUID, foreign key to users)

  2. Enums
    - task_status: Represents the possible states of a task
*/

-- Create task_status enum

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR NOT NULL UNIQUE,
  username VARCHAR NOT NULL,
  firebaseuser VARCHAR NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE
);

-- Create index on frequently queried columns
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);