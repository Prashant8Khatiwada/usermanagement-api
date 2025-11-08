# 🧩 User Management API (NestJS + PostgreSQL + Scalar)

A backend API built with **NestJS**, featuring:
- User CRUD operations
- PostgreSQL database integration
- Scalar API documentation
- Scalable modular architecture

---

## 🚀 Tech Stack

- **Backend:** [NestJS](https://nestjs.com)
- **Database:** PostgreSQL
- **ORM:** TypeORM (recommended)
- **Documentation:** [Scalar](https://scalar.com)
- **Package Manager:** Yarn

---

## ⚙️ Project Setup

### 1. Install dependencies

```bash
yarn install


markdown
# PostgreSQL Complete Beginner Guide

## Step 1: Connect to PostgreSQL
```bash
sudo -u postgres psql
```

You're now in the PostgreSQL shell. The prompt will look like: `postgres=#`

---

## Step 2: Basic Commands You NEED to Know

### View Databases
```sql
\l
```

### Create Your First Database
```sql
CREATE DATABASE testdb;
```

### Connect to Database
```sql
\c testdb
```

### View All Tables
```sql
\dt
```

### Create a Table
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    age INT,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### Insert Data
```sql
INSERT INTO users (name, email, age) VALUES ('Alice', 'alice@email.com', 25);
INSERT INTO users (name, email, age) VALUES ('Bob', 'bob@email.com', 30);
INSERT INTO users (name, email, age) VALUES ('Charlie', 'charlie@email.com', 22);
```

### Query Data
```sql
-- Select all
SELECT * FROM users;

-- Select specific columns with filter
SELECT name, email FROM users WHERE age > 23;

-- Order results
SELECT * FROM users ORDER BY age DESC;
```

### Update Data
```sql
UPDATE users SET age = 26 WHERE name = 'Alice';
```

### Delete Data
```sql
DELETE FROM users WHERE name = 'Bob';
```

### See Table Structure
```sql
\d users
```

### Exit PostgreSQL
```sql
\q
```

---

## Step 3: Core Concepts to Master

- **CREATE** - Make tables
- **INSERT** - Add data
- **SELECT** - Read data
- **UPDATE** - Modify data
- **DELETE** - Remove data
- **WHERE** - Filter results
- **JOIN** - Combine tables

---

## Step 4: Relationships (Important!)

### Create a Related Table
```sql
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    title VARCHAR(200),
    content TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### Insert Posts
```sql
INSERT INTO posts (user_id, title, content) VALUES (1, 'My First Post', 'Hello world!');
INSERT INTO posts (user_id, title, content) VALUES (1, 'Second Post', 'Learning PostgreSQL');
```

### JOIN Tables
```sql
SELECT users.name, posts.title, posts.content 
FROM users 
JOIN posts ON users.id = posts.user_id;
```

---

## Learning Path

### Week 1: CRUD Operations
- CREATE, INSERT, SELECT, UPDATE, DELETE
- Basic WHERE clauses

### Week 2: Filtering & Sorting
- Complex WHERE conditions
- ORDER BY, LIMIT, OFFSET
- LIKE, IN, BETWEEN operators

### Week 3: JOINs
- INNER JOIN
- LEFT JOIN
- RIGHT JOIN
- Understanding foreign keys

### Week 4: Aggregations
- COUNT, SUM, AVG, MIN, MAX
- GROUP BY
- HAVING clause

### Week 5: Advanced Topics
- Indexes for performance
- Constraints (UNIQUE, CHECK, NOT NULL)
- Transactions (BEGIN, COMMIT, ROLLBACK)

---

## Useful psql Commands

| Command | Description |
|---------|-------------|
| `\l` | List all databases |
| `\c dbname` | Connect to database |
| `\dt` | List all tables |
| `\d tablename` | Describe table structure |
| `\du` | List all users |
| `\q` | Quit psql |
| `\?` | Help with psql commands |
| `\h SQL_COMMAND` | Help with SQL commands |

---

## Practice Exercises

### Exercise 1: Create a Blog
```sql
-- Create tables for a simple blog
CREATE TABLE authors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    bio TEXT
);

CREATE TABLE articles (
    id SERIAL PRIMARY KEY,
    author_id INT REFERENCES authors(id),
    title VARCHAR(200),
    body TEXT,
    published_at TIMESTAMP DEFAULT NOW()
);

-- Insert data and practice JOINs
```

### Exercise 2: E-commerce Database
```sql
-- Create products and orders tables
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    price DECIMAL(10, 2),
    stock INT
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    product_id INT REFERENCES products(id),
    quantity INT,
    order_date TIMESTAMP DEFAULT NOW()
);

-- Practice aggregations with GROUP BY
```

---

## Tips

1. **Practice daily** - Even 15 minutes helps
2. **Break things** - Don't be afraid to mess up
3. **Read error messages** - They tell you what's wrong
4. **Use \d often** - To understand table structures
5. **Start simple** - Master basics before advanced topics

---

## Resources

- Official PostgreSQL Docs: https://www.postgresql.org/docs/
- PostgreSQL Tutorial: https://www.postgresqltutorial.com/
- SQL Practice: https://sqlzoo.net/

---

**Now stop reading and start typing! The only way to learn is by doing.**

# Run database migrations
yarn typeorm migration:run

# Run tests
yarn test
