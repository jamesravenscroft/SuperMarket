DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
 item_id INT NOT NULL AUTO_INCREMENT,
 product_name VARCHAR(45) NULL,
 department_name VARCHAR(45),
 price DECIMAL(10,2) NULL,
 stock_quantity INT NULL,
 PRIMARY KEY (item_id)
);

SELECT * FROM products;

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('1 session personal training', 'fitness', $100, 500);


INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES   ('2nd Chance Brewing 4 Pack Tablula Rasa Stout', 'beer', $16, 100);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES   ('Slothzilla Shirt', 'T-shirts', $22, 300);


INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES   ('4 weeks of Trivia Game', 'Trivia', $100, 500),

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES  ('Single Trivia Game', 'Trivia', $100, 500);
