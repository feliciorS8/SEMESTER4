CREATE DATABASE IF NOT EXISTS fullstackdev;

USE fullstackdev;

CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100),
    email VARCHAR(100)
);

INSERT INTO users (name, email)
SELECT 'allysa ananta', 'allysa@gmail.com'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'allysa@gmail.com');

INSERT INTO users (name, email)
SELECT 'rracheliya', 'rracheliya@gmail.com'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'rracheliya@gmail.com');

SELECT * FROM users;
