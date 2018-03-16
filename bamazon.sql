DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;
USE bamazon;

CREATE TABLE products(
    item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(150) NOT NULL,
    department_name VARCHAR(50) NULL DEFAULT "Miscellaneous",
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INT NOT NULL,
    product_sales DECIMAL(10,2)  DEFAULT 0.00,
    PRIMARY KEY (item_id)
);

INSERT INTO products(product_name,department_name,price,stock_quantity)
VALUES ("GIGABYTE Z370P D3 Motherboard","Electronics",99.99,320);
INSERT INTO products(product_name,department_name,price,stock_quantity)
VALUES ("Sony XB950B1 Extra Bass Wireless Headphones","Electronics",128.95,110);
INSERT INTO products(product_name,department_name,price,stock_quantity)
VALUES ("cable for Sony MDR-XB950BT","Electronics",9.00,27);
INSERT INTO products(product_name,department_name,price,stock_quantity)
VALUES ("Men's 121 Heritage Slim-Fit Jean","Clothing",57.00,32);
INSERT INTO products(product_name,department_name,price,stock_quantity)
VALUES ("Fossil Hybrid Smartwatch","Clothing",132.45,89);
INSERT INTO products(product_name,department_name,price,stock_quantity)
VALUES ("How Extraordinary People Become That Way","Books",18.35,45);
INSERT INTO products(product_name,department_name,price,stock_quantity)
VALUES ("Murach's JavaScript and jQuery","Books",44.66,65);
INSERT INTO products(product_name,department_name,price,stock_quantity)
VALUES ("Responsive Web Design by Example","Books",39.99,12);
INSERT INTO products(product_name,department_name,price,stock_quantity)
VALUES ("Bootstrap 4 Quick Start","Books",2.99,50);
INSERT INTO products(product_name,department_name,price,stock_quantity)
VALUES ("GOLF BALLS","Sports",2.50,1000);

CREATE TABLE departments(
    department_id INT NOT NULL AUTO_INCREMENT,
    department_name VARCHAR(50) NOT NULL,
    over_head_costs DECIMAL(10,2),
    PRIMARY KEY (department_id)
);

INSERT INTO departments(department_name,over_head_costs)
VALUES ("Electronics",1000);
INSERT INTO departments(department_name,over_head_costs)
VALUES ("Clothing",700);
INSERT INTO departments(department_name,over_head_costs)
VALUES ("Books ",850);
INSERT INTO departments(department_name,over_head_costs)
VALUES ("Sports",550);