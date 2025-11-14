CREATE DATABASE IF NOT EXISTS fitsphere;
USE fitsphere;

DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS members;
DROP TABLE IF EXISTS membership_plans;
DROP TABLE IF EXISTS sports;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'user') NOT NULL DEFAULT 'user'
);

CREATE TABLE sports (
  sport_id INT AUTO_INCREMENT PRIMARY KEY,
  sport_name VARCHAR(120) NOT NULL,
  description TEXT
);

CREATE TABLE membership_plans (
  plan_id INT AUTO_INCREMENT PRIMARY KEY,
  plan_name VARCHAR(120) NOT NULL,
  duration_months INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL
);

CREATE TABLE members (
  member_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  age INT,
  gender VARCHAR(50),
  phone VARCHAR(30),
  address TEXT,
  sport_id INT,
  plan_id INT,
  join_date DATE,
  CONSTRAINT fk_members_sport FOREIGN KEY (sport_id) REFERENCES sports (sport_id) ON DELETE SET NULL,
  CONSTRAINT fk_members_plan FOREIGN KEY (plan_id) REFERENCES membership_plans (plan_id) ON DELETE SET NULL
);

CREATE TABLE payments (
  payment_id INT AUTO_INCREMENT PRIMARY KEY,
  member_id INT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  status ENUM('Paid', 'Pending') NOT NULL DEFAULT 'Pending',
  date DATE,
  CONSTRAINT fk_payments_member FOREIGN KEY (member_id) REFERENCES members (member_id) ON DELETE CASCADE
);

INSERT INTO users (name, email, password, role) VALUES
('Club Admin', 'admin@fitsphere.club', '$2b$10$d90TnHpXUIreVwEqRQUr9.Cg/7RAqXvLAQlUtLIZonHJyRj8/Q37y', 'admin'),
('Emily Chen', 'emily@fitsphere.club', '$2b$10$d90TnHpXUIreVwEqRQUr9.Cg/7RAqXvLAQlUtLIZonHJyRj8/Q37y', 'user');

INSERT INTO sports (sport_name, description) VALUES
('Basketball', 'Indoor training program focusing on agility, shooting, and teamwork.'),
('Swimming', 'Comprehensive swim coaching for all levels with access to Olympic pools.'),
('Tennis', 'Professional coaching and ladder tournaments for singles and doubles.'),
('CrossFit', 'High-intensity functional training sessions led by certified coaches.');

INSERT INTO membership_plans (plan_name, duration_months, price) VALUES
('Starter Plan', 3, 129.00),
('Performance Plan', 6, 239.00),
('Elite Plan', 12, 429.00);

INSERT INTO members (name, age, gender, phone, address, sport_id, plan_id, join_date) VALUES
('Jordan Miles', 24, 'Male', '+1-202-555-0147', '42 Arena Avenue, Sportstown', 1, 2, '2025-01-10'),
('Priya Patel', 29, 'Female', '+1-202-555-0199', '18 Lakeview Drive, Sportstown', 2, 3, '2024-12-02'),
('Carlos Ramirez', 32, 'Male', '+1-202-555-0112', '77 Peak Road, Sportstown', 4, 1, '2025-02-05');

INSERT INTO payments (member_id, amount, status, date) VALUES
(1, 239.00, 'Paid', '2025-01-10'),
(1, 239.00, 'Pending', '2025-07-10'),
(2, 429.00, 'Paid', '2024-12-02'),
(3, 129.00, 'Pending', '2025-02-05');
