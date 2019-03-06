/customer view
const mysql = require("mysql");
const inquirer = require("inquirer");
const mysqlConfig = {
    host: "localhost",
    port: 3306,
    user: "root",
    password: "P455W0RD",
    database: "bamazonDB"
};
const connection = mysql.createConnection(mysqlConfig);

connection.connect(function(err) {
    if(err) throw err;
    console.log("\nWelcome to Bamazon.")
    start();
});

function start() {
    connection.query(
        "SELECT id, product_name, price, stock_quantity FROM products", function(err,res){
            for(var i = 0; i <res.length; i++) {
                //var cantidad = res[i];
                //console.log(cantidad);
                console.log("Id: " + res[i].id +
                "|| Product: " + res[i].product_name + "|| Price: " + res[i].price);
            }inquirer
            .prompt(
            {
                name: "sale",
                type: "input",
                message: "What would you like to buy Enter ID?"
            })
            .then(function(answer) {
                var cosa = res[answer.sale - 1];
                //console.log(cosa);
                var cosaNombre = cosa.product_name;
                var cosaCantidad = cosa.stock_quantity;
                console.log("You want " + cosaNombre + " with " + cosaCantidad + " in stock.");
              
              inquirer
              .prompt(
                {
                    name: "order",
                    type: "input",
                    message: "How much do you want to buy?"
                }
              )
              .then(function(answer) {
                var stockLeft = parseInt(cosaCantidad) - parseInt(answer.order);
                var totalPaid = parseInt(cosa.price) * parseInt(answer.order);
                console.log("You bought: " + answer.order + " " + cosaNombre);
                console.log("Your total is: $" + totalPaid)
                console.log("There is now " + stockLeft + " left.");
                connection.query("UPDATE products SET ? WHERE ?",
                [
                    {
                        stock_quantity: stockLeft
                    },
                    {
                        id: cosa.id
                    }
                ],
                function(err) {
                    if(err) throw err;
                    console.log("Stock has been updated");
                    connection.end();
                }
              );
              })            
            })          
        });

}