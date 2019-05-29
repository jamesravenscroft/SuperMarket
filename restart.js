//restart
var mysql = require('mysql');;
var inquirer=require('inquirer');
var table=require('console.table');
const mysqlConfig = {
    host:'localhost',
    port: 3306,
    user: 'root',
    database: 'bamazon'
};

const connection = mysql.createConnection(mysqlConfig);

connection.connect(function(err){
if(err) {
    console.log(err);
} else {
    loadProducts();
}
})

function loadProducts(){
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
inquirer.prompt([
    {
        type: 'input',
        name: 'product_id',
        message: "What wonderful products would you like to try today?"

    },
    {
        type: 'input',
        name: 'amount_needed',
        message: "Excellent choice! How many of this fantastic item would you like?"

    },
]).then(function(inqRes){
    var id=inqRes.product_id;
    var amount = inqRes.amount_needed;
    makePurchase(id, amount);
})
}

function makePurchase(id, amount){
    var stock_quantity = 0;
    if (amount > stock_quantity){
        console.log("Unfortunately we are out of those but you should definitely get something else now!")
    } else {
        connection.query('UPDATE products SET stock_quauntity - ? WHERE item_id = ?',
    [amount, id],
    function(err, response){
        if (err) {
            return console.log(err)
        }

        loadProducts();
        })
    }
}

//two hardest things about this conceptually
//#1- connection.connect redundancy....
//#2- why do tables hate me?
//#3- javascript can make MYSQL calls but not Vice Versa?
