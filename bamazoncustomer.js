var mysql = require('mysql');
var inquirer = require('inquirer');
require('console.table');

// require('console.table');
const mysqlConfig = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    database: 'bamazon'
};

var connection = mysql.createConnection(mysqlConfig);

function start() {
    connection.query(
    "SELECT id, product_name, price, stock_quantity FROM products", function(err,res){
        for(var i = 0; i <res.length; i++) {
            //console.table(quantity);
            console.table("Id: " + res[i].id +
            "|| Product: " + res[i].product_name + "|| Price: " + res[i].price);
        }inquirer
        .prompt(
        {
            name: "sale",
            type: "input",
            message: "What would you like to buy Enter ID?"
        })
        .then(function(answer) {
            var item = res[answer.sale - 1];
            //console.table(item);
            var productName = item.product_name;
            var productQuantity = item.stock_quantity;
            console.table("You want " + productName + " with " + productQuantity + " in stock.");
            
            inquirer
            .prompt(
            {
                name: "order",
                type: "input",
                message: "How much do you want to buy?"
            }
            )
            .then(function(answer) {
            var stockLeft = parseInt(productQuantity) - parseInt(answer.order);
            var totalPaid = parseInt(product.price) * parseInt(answer.order);
            console.table("You bought: " + answer.order + " " + productName);
            console.table("Your total is: $" + totalPaid);
            console.table("There is now " + stockLeft + " left.");
            connection.query("UPDATE products SET ? WHERE ?",
            [
                {
                    stock_quantity: stockLeft
                },
                {
                    id: product.id
                }
            ],
            function(err) {
                if(err) throw err;
                console.table("Stock has been updated");
                connection.end();
            }
            );
            })            
        })          
    });

}
//failed expirement #5 
// connection.connect(function(err) {
//     if(err) {
//         console.table(err);
//     } 
//     else {
//         loadProducts();
//     }
// })

// function loadProducts() {
//     connection.query("SELECT product_name, price, stock_quantity * FROM products", function(err, results){
//         if(err){
//             console.table(err);
//         } else {
//             console.table(results);
//         }
//         promptUser();
//     })
// }

// function promptUser(){
//     inquirer
//     .prompt([
//         {
//             type: 'input',
//             name: 'product_id',
//             message: "What product id are you interested in?"
//         },

//         {
//             type: 'input',
//             name: 'amount_needed',
//             message: "How many do you need?"
//         }
//     ])
//     .then(function(inqRes){
//         // console.table(inqRes); 
//         var id = inqRes.product_id;
//         var amount = inqRes.amount_needed;
//         makePurchase(id, amount);
//     })
// }

// function makePurchase(id, amount){
//     // Get stock quanity from data base - use connection
//     var stock_quantity = 0; // Assign result to variable

//     if (amount > stock_quantity) {
//         console.table("Not enough stock!")
//     } else {
//         connection.query('UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_id = ?',
//             [amount, id], 
//             function (err, response) {
//                 if (err) {
//                     return console.table(err)
//                 } 

//                 loadProducts();
//             })
//     }
    
// }
