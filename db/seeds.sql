-- Insert into department table
INSERT INTO department (name) VALUES 
('Sales'),
('Engineering'),
('HR');

-- Insert into role table
INSERT INTO role (title, salary, department_id) VALUES 
('Sales Lead', 60000, 1),
('Software Engineer', 90000, 2),
('HR Manager', 75000, 3);

-- Insert into employee table
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES 
('John', 'Doe', 1, NULL),
('Jane', 'Smith', 2, 1),
('Emma', 'Brown', 3, NULL);
