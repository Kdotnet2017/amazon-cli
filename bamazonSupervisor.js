require("dotenv").config();
var inquirer=require("inquirer");
var mysql = require("mysql");
//NPM package that can log the table to the console
var cTable = require("console.table");
var item = require("./item.js");
var connection = mysql.createConnection({
    host: process.env.MySQL_Host,
    port: process.env.MySQL_Port,
    user: process.env.MySQL_User,
    password: process.env.MySQL_Password,
    database: process.env.MySQL_database,
});
function startSupervisor() {
    console.log("\n\n");
    inquirer.prompt([
        {
            type: "list",
            name: "menu",
            message: "Please select one option:",
            choices: ["View Product Sales by Department", "Create New Department", "Exit"],
        }
    ]).then(function (response) {
        console.log(response.menu); 
        switch (response.menu) {
            case "View Product Sales by Department":
                var query=`
                        SELECT d.department_id As Id,d.department_name AS Name,concat('$',format(d.over_head_costs,2)) AS over_head_costs,
                        concat('$',format(p.product_sales,2)) AS product_sales,concat('$',format((p.product_sales-d.over_head_costs) ,2)) AS total_profit
                        FROM departments d
                        INNER JOIN (
                            SELECT department_name,SUM(product_sales) AS product_sales ,COUNT(department_name)
                            FROM products
                            GROUP BY department_name ) p ON d.department_name=p.department_name;
                        `;
                readDatabase(query);
                break;
            case "Create New Department":
                addNewDepartment();
                break;
            case "Exit":
                process.exit();
            default:
                break;
        }
    });
}

function readDatabase(query) {
    connection.query(query, function (err, res) {
        if (err) {
            console.log(err);
            throw err;
        }
        if (res.length > 0) {
            console.log("\n\n");
            console.log(cTable.getTable(res));
        }
        else {
            console.log("\n\t There is no record!!");
        }
        startSupervisor();
    });
}

function addNewDepartment() {
    inquirer.prompt([
        {
            type: "input",
            message: "What is the Department NAME?",
            name: "depName",
            validate: function (value) {
                if (value && value.trim()!=="" ) {
                    return true;
                }
                else {
                    return false;
                }
            }
        },
        {                            //over_head_costs
            type: "input",
            message: "What is the Department OVER HEAD COSTS?",
            name: "depOHC",
            validate: function (value) {
                if (value && value.trim()!==""  && isNaN(value) === false) { return true; }
                else { return false; }
            }
        }
    ]).then(function (res) {
        var newDepartment = {department_name:res.depName,over_head_costs:res.depOHC};
        insertNewDepartment(newDepartment);
        console.log("\n\t The new Department was created successfully!\n");
        startSupervisor();
    });
}
function insertNewDepartment(newDepartment) {
    connection.query("INSERT INTO departments SET ?",
        {
            department_name: newDepartment.department_name,
            over_head_costs: newDepartment.over_head_costs
        }, function (err) {
            if (err) {
                console.log(err);
                throw err;
            }
            else {
                return true;
            }
        })
}


startSupervisor();