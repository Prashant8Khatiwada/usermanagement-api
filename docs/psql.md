# Run database migrations
yarn typeorm migration:run

# Run tests
yarn test

## Connect to PostgreSQL:
- sudo -u postgres psql

## Basic Commands (once inside psql):
  # List all databases
   - \l

  # Create a new database
   -CREATE DATABASE myapp;

  # Connect to a database
   -\c myapp

  # List all tables
   -\dt

  # Create a table
   -CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        email VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   -);

  # Insert data
   -INSERT INTO users (name, email) VALUES ('John Doe', 'john@example.com');

  # Query data
   -SELECT * FROM users;

  # Exit psql
   -\q

  ## Quick creation
 CREATE DATABASE user_db;
 CREATE USER nest_user WITH PASSWORD 'anihortes';
 GRANT ALL PRIVILEGES ON DATABASE user_db TO nest_user;
 GRANT ALL ON SCHEMA public TO nest_user;
 ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO nest_user;
 ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO nest_user;
