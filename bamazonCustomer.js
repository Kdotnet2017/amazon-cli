require("dotenv").config();
var mysql = require("mysql");
var inquirer = require("inquirer");
var cTable = require("console.table");
var item = require("./item.js");
var purchasedItem;
var connection = mysql.createConnection({
    host: process.env.MySQL_Host,
    port: process.env.MySQL_Port,
    user: process.env.MySQL_User,
    password: process.env.MySQL_Password,
    database: process.env.MySQL_database,
});
function readDatabase(query) {
    connection.connect(function (err) {
        if (err) {
            console.log(err);
            throw err;
        }
        connection.query(query, function (err, res) {
            if (err) {
                console.log(err);
                throw err;
            }
            console.log(cTable.getTable(res));
            placeAnOrder();
        });
    });
}
function updateSQL(myItem) {
    connection.query("UPDATE products SET ? WHERE?",
        [{ stock_quantity: myItem.stockQuantity, product_sales: myItem.Sales },
        { item_id: myItem.Id }],
        function (err) {
            if (err) throw err;
        });
}
function checkAvailability(requestedItem) {
    connection.query("select price, stock_quantity, product_sales  from products where item_id=" + requestedItem.Id, function (err, res) {
        if (res.length > 0) {
            if (parseInt(res[0].stock_quantity) > parseInt(requestedItem.Quantity)) {
                console.log("\n\n\tWe will fulfill your order. Thank you for your business!\n");
                requestedItem.stockQuantity = parseInt(res[0].stock_quantity) - parseInt(requestedItem.Quantity);
                requestedItem.Price = parseFloat(res[0].price);
                requestedItem.Sales = parseFloat(res[0].product_sales);
                requestedItem.updateSales();
                updateSQL(requestedItem);
                console.log("\t\tTotal Amount to pay is: $" + parseFloat(requestedItem.Price * requestedItem.Quantity).toFixed(2));
                connection.end();
            }
            else {
                console.log("\n\t\tInsufficient quantity!");
                console.log("\n\t\tTry it again with less quantity...");
                placeAnOrder();
            }
        }
        else {
            console.log("\n\t\tThe Id is wrong. Please try it again...");
            placeAnOrder();
        }
    });
}
function placeAnOrder() {
    inquirer.prompt([
        {
            type: "input",
            message: "What is the ID of the product which you would like to order?",
            name: "itemId",
            validate: function (value) {
                if (value && value.trim()!=="" && isNaN(value) === false) {
                    return true;
                }
                else {
                    return false;
                }
            }
        },
        {
            type: "input",
            message: "How many units of the product would you like to purchase?",
            name: "itemQty",
            validate: function (value) {
                if (value && value.trim()!==""  && isNaN(value) === false) { return true; }
                else { return false; }
            }
        }
    ]).then(function (res) {
        var myItem = new item(res.itemId, res.itemQty);
        checkAvailability(myItem);
    });
}
console.log("\n\n\t\t\tList of Items\n");
readDatabase("SELECT item_id as Id,product_name AS Name,concat('$', format(price, 2)) AS price FROM products");


