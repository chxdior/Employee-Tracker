const inquirer = require('inquirer');

const viewDepartments = async (client) => {
  const res = await client.query('SELECT * FROM department');
  console.table(res.rows);
};

const viewRoles = async (client) => {
  const res = await client.query(`
    SELECT role.id, role.title, department.name AS department, role.salary
    FROM role
    JOIN department ON role.department_id = department.id
  `);
  console.table(res.rows);
};

const viewEmployees = async (client) => {
  const res = await client.query(`
    SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, manager.first_name AS manager
    FROM employee
    JOIN role ON employee.role_id = role.id
    JOIN department ON role.department_id = department.id
    LEFT JOIN employee manager ON employee.manager_id = manager.id
  `);
  console.table(res.rows);
};

const addDepartment = async (client) => {
  const { name } = await inquirer.prompt([{ name: 'name', message: 'Department name:' }]);
  await client.query('INSERT INTO department (name) VALUES ($1)', [name]);
  console.log(`Added department: ${name}`);
};

const addRole = async (client) => {
  const departments = await client.query('SELECT * FROM department');
  const { title, salary, department_id } = await inquirer.prompt([
    { name: 'title', message: 'Role title:' },
    { name: 'salary', message: 'Role salary:' },
    {
      type: 'list',
      name: 'department_id',
      message: 'Department:',
      choices: departments.rows.map(department => ({ name: department.name, value: department.id }))
    }
  ]);
  await client.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)', [title, salary, department_id]);
  console.log(`Added role: ${title}`);
};

const addEmployee = async (client) => {
  const roles = await client.query('SELECT * FROM role');
  const employees = await client.query('SELECT * FROM employee');
  const { first_name, last_name, role_id, manager_id } = await inquirer.prompt([
    { name: 'first_name', message: 'Employee first name:' },
    { name: 'last_name', message: 'Employee last name:' },
    {
      type: 'list',
      name: 'role_id',
      message: 'Employee role:',
      choices: roles.rows.map(role => ({ name: role.title, value: role.id }))
    },
    {
      type: 'list',
      name: 'manager_id',
      message: 'Employee manager:',
      choices: [{ name: 'None', value: null }].concat(employees.rows.map(employee => ({ name: `${employee.first_name} ${employee.last_name}`, value: employee.id })))
    }
  ]);
  await client.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', [first_name, last_name, role_id, manager_id]);
  console.log(`Added employee: ${first_name} ${last_name}`);
};

const updateEmployeeRole = async (client) => {
  const employees = await client.query('SELECT * FROM employee');
  const roles = await client.query('SELECT * FROM role');
  const { employee_id, role_id } = await inquirer.prompt([
    {
      type: 'list',
      name: 'employee_id',
      message: 'Select employee to update:',
      choices: employees.rows.map(employee => ({ name: `${employee.first_name} ${employee.last_name}`, value: employee.id }))
    },
    {
      type: 'list',
      name: 'role_id',
      message: 'Select new role:',
      choices: roles.rows.map(role => ({ name: role.title, value: role.id }))
    }
  ]);
  await client.query('UPDATE employee SET role_id = $1 WHERE id = $2', [role_id, employee_id]);
  console.log('Employee role updated.');
};

module.exports = {
  viewDepartments,
  viewRoles,
  viewEmployees,
  addDepartment,
  addRole,
  addEmployee,
  updateEmployeeRole
};
