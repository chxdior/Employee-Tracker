const inquirer = require('inquirer');
const { Client } = require('pg');

// Connect to the PostgreSQL database
const client = new Client({
    connectionString: 'postgresql://user:password@localhost:5432/employee_tracker'
});
client.connect();

const mainMenu = async () => {
    const { action } = await inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: [
                'View all departments',
                'View all roles',
                'View all employees',
                'Add a department',
                'Add a role',
                'Add an employee',
                'Update an employee role',
                'Exit'
            ]
        }
    ]);

    switch (action) {
        case 'View all departments':
            viewDepartments();
            break;
        case 'View all roles':
            viewRoles();
            break;
        case 'View all employees':
            viewEmployees();
            break;
        case 'Add a department':
            addDepartment();
            break;
        case 'Add a role':
            addRole();
            break;
        case 'Add an employee':
            addEmployee();
            break;
        case 'Update an employee role':
            updateEmployeeRole();
            break;
        default:
            client.end();
    }
};

mainMenu();

const viewDepartments = async () => {
    const res = await client.query('SELECT * FROM department');
    console.table(res.rows);
    mainMenu();
};

const viewRoles = async () => {
    const res = await client.query(`
      SELECT role.id, role.title, role.salary, department.name AS department 
      FROM role
      JOIN department ON role.department_id = department.id`);
    console.table(res.rows);
    mainMenu();
};

const viewEmployees = async () => {
    const res = await client.query(`
      SELECT e.id, e.first_name, e.last_name, role.title, department.name AS department, role.salary, 
      m.first_name AS manager_first, m.last_name AS manager_last
      FROM employee e
      LEFT JOIN employee m ON e.manager_id = m.id
      JOIN role ON e.role_id = role.id
      JOIN department ON role.department_id = department.id`);
    console.table(res.rows);
    mainMenu();
};

const addDepartment = async () => {
    const { name } = await inquirer.prompt([{ name: 'name', message: 'Department name:' }]);
    await client.query('INSERT INTO department (name) VALUES ($1)', [name]);
    console.log(`Added department: ${name}`);
    mainMenu();
};

const addRole = async () => {
    const departments = await client.query('SELECT * FROM department');
    const departmentChoices = departments.rows.map(d => ({ name: d.name, value: d.id }));
    const { title, salary, department_id } = await inquirer.prompt([
        { name: 'title', message: 'Role title:' },
        { name: 'salary', message: 'Role salary:' },
        { type: 'list', name: 'department_id', message: 'Department:', choices: departmentChoices }
    ]);
    await client.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)', [title, salary, department_id]);
    console.log(`Added role: ${title}`);
    mainMenu();
};

const addEmployee = async () => {
    const roles = await client.query('SELECT * FROM role');
    const roleChoices = roles.rows.map(r => ({ name: r.title, value: r.id }));
    const employees = await client.query('SELECT * FROM employee');
    const managerChoices = employees.rows.map(e => ({ name: `${e.first_name} ${e.last_name}`, value: e.id }));
    managerChoices.unshift({ name: 'None', value: null });

    const { first_name, last_name, role_id, manager_id } = await inquirer.prompt([
        { name: 'first_name', message: 'First name:' },
        { name: 'last_name', message: 'Last name:' },
        { type: 'list', name: 'role_id', message: 'Role:', choices: roleChoices },
        { type: 'list', name: 'manager_id', message: 'Manager:', choices: managerChoices }
    ]);
    await client.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', [first_name, last_name, role_id, manager_id]);
    console.log(`Added employee: ${first_name} ${last_name}`);
    mainMenu();
};

const updateEmployeeRole = async () => {
    const employees = await client.query('SELECT * FROM employee');
    const employeeChoices = employees.rows.map(e => ({ name: `${e.first_name} ${e.last_name}`, value: e.id }));
    const roles = await client.query('SELECT * FROM role');
    const roleChoices = roles.rows.map(r => ({ name: r.title, value: r.id }));

    const { employee_id, role_id } = await inquirer.prompt([
        { type: 'list', name: 'employee_id', message: 'Select employee:', choices: employeeChoices },
        { type: 'list', name: 'role_id', message: 'Select new role:', choices: roleChoices }
    ]);
    await client.query('UPDATE employee SET role_id = $1 WHERE id = $2', [role_id, employee_id]);
    console.log('Updated employee role');
    mainMenu();
};
