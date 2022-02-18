CREATE DATABASE shop;

CREATE TABLE users(
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(100) NOT NULL,
  CONSTRAINT check_email CHECK(email ~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$')
);

ALTER TABLE users ADD CONSTRAINT check_password CHECK(length(password) >= 6);

INSERT INTO users(name, email, password) VALUES('jim', 'jim@gmail.com', '123456');

CREATE TABLE products(
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  price DECIMAl NOT NULL,
  description VARCHAR(255) NOT NULL,
  image VARCHAR(255) NOT NULL,
  creator_id INT NOT NULL REFERENCES users (id),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

ALTER TABLE users ADD COLUMN created_at TIMESTAMP DEFAULT NOW();

ALTER TABLE products ADD COLUMN stock INT NOT NULL DEFAULT 0;

UPDATE products SET stock=1 WHERE id=6;

CREATE TABLE reviews(
  id SERIAL PRIMARY KEY,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  content VARCHAR(255) NOT NUll,
  creator_id INT NOT NULL REFERENCES users(id),
  product_id INT NOT NULL REFERENCES products(id),
  created_at TIMESTAMP DEFAULT NOW()
);

SELECT * FROM products LEFT JOIN reviews ON products.id = reviews.product_id;

SELECT * FROM products LEFT JOIN (SELECT product_id, count(product_id), TRUNC(AVG(rating), 1) AS AVG FROM reviews GROUP BY product_id) reviews ON products.id = reviews.product_id;

SELECT * FROM products LEFT JOIN (SELECT product_id, count(product_id), TRUNC(AVG(rating), 1) AS AVG FROM reviews GROUP BY product_id) reviews ON products.id = reviews.product_id WHERE id=3;

ALTER TABLE reviews ADD COLUMN creator VARCHAR(50);

UPDATE reviews SET creator='kevin' WHERE id=5;