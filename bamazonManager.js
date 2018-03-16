require("dotenv").config();
var inquirer = require("inquirer");
var mysql = require("mysql");
var cTable = require("console.table");
var item = require("./item.js");
var connection = mysql.createConnection({
    host: process.env.MySQL_Host,
    port: process.env.MySQL_Port,
    user: process.env.MySQL_User,
    password: process.env.MySQL_Password,
    database: process.env.MySQL_database,
});
connection.connect(function (err) {
    if (err) {
        console.log(err);
        throw err;
    }
});
function addNewItem() {
    inquirer.prompt([
        {
            type: "input",
            message: "What is the item NAME?",
            name: "itemName",
            validate: function (value) {
                if (value && value.trim()!=="" ) {
                    return true;
                }
                else {
                    return false;
                }
            }
        },
        {
            type: "input",
            message: "What is the item PRICE?",
            name: "itemPrice",
            validate: function (value) {
                if (value && value.trim()!==""  && isNaN(value) === false) { return true; }
                else { return false; }
            }
        },
        {
            type: "input",
            message: "What is the item QUANTITY?",
            name: "itemQty",
            validate: function (value) {
                if (value && value.trim()!==""  && isNaN(value) === false) { return true; }
                else { return false; }
            }
        },
        { 
            type: "input",
            message: "The item belongs to what DEPARTMENT?",
            name: "itemDepartment",
            validate: function (value) {
                if (value && value.trim()!=="" ) { return true; }
                else { return false; }
            }
        },

    ]).then(function (res) {
        var myItem = new item(0, res.itemQty);
        myItem.Name = res.itemName;
        myItem.Price = res.itemPrice;
        myItem.departmentName=res.itemDepartment;
        insertNewItem(myItem);
        console.log("\n\t The new item was created successfully!\n");
        startManager();
    });
}
function insertNewItem(myItem) {
    connection.query("INSERT INTO products SET ?",
        {
            product_name: myItem.Name,
            price: myItem.Price,
            stock_quantity: myItem.Quantity,
            department_name:myItem.departmentName
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
function addInventory() {
    inquirer.prompt([
        {
            type: "input",
            message: "What is the ID of the product which you want to add more?",
            name: "itemId",
            validate: function (value) {
                if (value && value.trim()!==""  && isNaN(value) === false) {
                    return true;
                }
                else {
                    return false;
                }
            }
        },
        {
            type: "input",
            message: "How many units of the product would you like to add more?",
            name: "itemQty",
            validate: function (value) {
                if (value && value.trim()!==""  && isNaN(value) === false) { return true; }
                else { return false; }
            }
        }
    ]).then(function (res) {
        var myItem = new item(res.itemId, res.itemQty);
        addMore(myItem);
    });
}

function addMore(requestedItem) {
    connection.query("select item_Id, stock_quantity  from products where item_id=" + requestedItem.Id, function (err, res) {
        if (res.length > 0) {
            requestedItem.stockQuantity = parseInt(res[0].stock_quantity);
            updateSQL(requestedItem);
            startManager();
        }
        else {
            console.log("\n\t\tThe Id is wrong. Please try it again...");
            addInventory();
        }
    });
}

function updateSQL(myItem) {
    connection.query("UPDATE products SET ? WHERE?",
        [{ stock_quantity: parseInt(myItem.stockQuantity) + parseInt(myItem.Quantity) },
        { item_id: myItem.Id }],
        function (err) {
            if (err) throw err;
        });
}

function readDatabase(query) {
    connection.query(query, function (err, res) {
        if (err) {
            console.log(err);
            throw err;
        }
        if (res.length > 0) {
            console.log(cTable.getTable(res));
        }
        else {
            console.log("\n\t There is no record!!");
        }
        startManager();
    });
}
function startManager() {
    console.log("\n\n");
    inquirer.prompt([
        {
            type: "list",
            name: "menu",
            message: "Please select one option:",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"],
        }
    ]).then(function (response) {
        console.log(response.menu);
        switch (response.menu) {
            case "View Products for Sale":
                readDatabase("SELECT item_id as Id,product_name AS Name,concat('$', format(price, 2)) AS price,stock_quantity as Quantity  FROM products where stock_quantity > 0");
                break;
            case "View Low Inventory":
                readDatabase("SELECT item_id as Id,product_name AS Name,concat('$', format(price, 2)) AS price,stock_quantity as Quantity  FROM products where stock_quantity < 5");
                break;
            case "Add to Inventory":
                addInventory();
                break;
            case "Add New Product":
                addNewItem();
                break;
            case "Exit":
                process.exit();
            default:
                break;
        }
    });
}
startManager();