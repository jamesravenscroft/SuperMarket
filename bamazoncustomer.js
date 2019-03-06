var mysql = require('mysql');
var inquirer = require('inquirer');
require('console.table');

const mysqlConfig = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: "HerdyDerdy202",
    database: 'bamazon'
};

var connection = mysql.createConnection(mysqlConfig);

connection.connect(function(err) {
    if(err) {
        console.log(err);
    } 
    else {
        loadProducts();
    }
})

function loadProducts() {
    connection.query("SELECT * FROM products", function(err, results){
        if(err){
            console.log(err);
        } else {
            console.table(results);
        }
        promptUser();
    })
}

function promptUser(){
    inquirer
    .prompt([
        {
            type: 'input',
            name: 'product_id',
            message: "What product id are you interested in?"
        },

        {
            type: 'input',
            name: 'amount_needed',
            message: "How many do you need?"
        }
    ])
    .then(function(inqRes){
        // console.log(inqRes); 
        var id = inqRes.product_id;
        var amount = inqRes.amount_needed;
        makePurchase(id, amount);
    })
}

function makePurchase(id, amount){
    // Get stock quanity from data base - use connection
    var stock_quantity = 0; // Assign result to variable

    if (amount > stock_quantity) {
        console.log("Not enough stock!")
    } else {
        connection.query('UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_id = ?',
            [amount, id], 
            function (err, response) {
                if (err) {
                    return console.log(err)
                } 

                loadProducts();
            })
    }
    
}