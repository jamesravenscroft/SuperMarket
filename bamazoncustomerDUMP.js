const mysqlConfig = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: ,
  database: 'bamazon'

};

const connection = mysql.createConnection(mysqlConfig);

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



// // .................................checked..................
// var mysql = require("mysql");
// var inquirer = require("inquirer");
// create the connection information for the sql database
// var connection = mysql.createConnection({
//   host: "localhost",
// Your port; if not 3306
    // port: 3306,
    //   // Your username
  // user: "root",
  // Your password
//   password: "",
//   database: "bamazondb"
// });
//from GreatBay Exercise
// function start() {
//     inquirer
//       .prompt({
//         name: "postOrBid",
//         type: "list",
//         message: "Would you like to [POST] an auction or [BID] on an auction?",
//         choices: ["POST", "BID", "EXIT"]
//       })
//       .then(function(answer) {
//         // based on their answer, either call the bid or the post functions
//         if (answer.postOrBid === "POST") {
//           postAuction();
//         }
//         else if(answer.postOrBid === "BID") {
//           bidAuction();
//         } else{
//           connection.end();
//         }
//       });
//   }



//ask for id number?
// prompt("Welcome, most valued customer. What would you like to buy on this most excellent of days?")


// prompt("How many units of this fantastic product would you like to buy?")

// insert into products


//The first should ask them the ID of the product they would like to buy.
// The second message should ask how many units of the product they would like to buy.

//7. Once the customer has placed the order, your application should check if your store has enough of the product to meet the customer's request.
//on click confirm button
// DROP DATABASE IF EXISTS amazondb;
// CREATE DATABASE amazondb;

// USE bamazondb;

// CREATE TABLE products(
//   id INT NOT NULL AUTO_INCREMENT,
//   item_name VARCHAR(100) NOT NULL,
//  item_quantity INT 
// //   PRIMARY KEY (id)
// // );

// function buyItem(options){
//     var options = options || {};
//     this.name = options.name || "DefaultFood";
//     this.amount = options.amount || 100;
//     this.decrease = options.decrease || 1;
//     this.eat = function(){
//         this.amount -= this.decrease;
//         if (this.amount < 0){
//             console.log("Food Gone");
//         }
//     }
// }

// // Then create new foods.
// var carrots = new FoodItem({
//     name:"Carrots",
//     amount:50,
//     decrease:2
// });

// carrots.eat();

//If not, the app should log a phrase like `
console.log("Insufficient quantity!"); 

// and then prevent the order from going through.

//8. However, 
if{ "your store _does_ have enough of the product you should fulfill the customer's order."}
//This means updating the SQL database
//  to reflect the remaining quantity.Once the
//   update goes through, show the customer the total
//    cost of their purchase


// * If this activity took you between 8-10 hours, 
// then you've put enough time into this assignment.
//  Feel free to stop here -- unless you want to take
//   on the next challenge.

// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  start();
});

// function which prompts the user for what action they should take
// function to handle posting new items up for auction
function postAuction() {
  // prompt for info about the item being put up for auction
  inquirer
    .prompt([
      {
        name: "item",
        type: "input",
        message: "What is the item you would like to submit?"
      },
      {
        name: "category",
        type: "input",
        message: "What category would you like to place your auction in?"
      },
      {
        name: "startingBid",
        type: "input",
        message: "What would you like your starting bid to be?",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      }
    ])
    .then(function(answer) {
      // when finished prompting, insert a new item into the db with that info
      connection.query(
        "INSERT INTO auctions SET ?",
        {
          item_name: answer.item,
          category: answer.category,
          starting_bid: answer.startingBid || 0,
          highest_bid: answer.startingBid || 0
        },
        function(err) {
          if (err) throw err;
          console.log("Your auction was created successfully!");
          // re-prompt the user for if they want to bid or post
          start();
        }
      );
    });
}

function bidAuction() {
  // query the database for all items being auctioned
  connection.query("SELECT * FROM auctions", function(err, results) {
    if (err) throw err;
    // once you have the items, prompt the user for which they'd like to bid on
    inquirer
      .prompt([
        {
          name: "choice",
          type: "rawlist",
          choices: function() {
            var choiceArray = [];
            for (var i = 0; i < results.length; i++) {
              choiceArray.push(results[i].item_name);
            }
            return choiceArray;
          },
          message: "What auction would you like to place a bid in?"
        },
        {
          name: "bid",
          type: "input",
          message: "How much would you like to bid?"
        }
      ])
      .then(function(answer) {
        // get the information of the chosen item
        var chosenItem;
        for (var i = 0; i < results.length; i++) {
          if (results[i].item_name === answer.choice) {
            chosenItem = results[i];
          }
        }

        // determine if bid was high enough
        if (chosenItem.highest_bid < parseInt(answer.bid)) {
          // bid was high enough, so update db, let the user know, and start over
          connection.query(
            "UPDATE auctions SET ? WHERE ?",
            [
              {
                highest_bid: answer.bid
              },
              {
                id: chosenItem.id
              }
            ],
            function(error) {
              if (error) throw err;
              console.log("Bid placed successfully!");
              start();
            }
          );
        }
        else {
          // bid wasn't high enough, so apologize and start over
          console.log("Your bid was too low. Try again...");
          start();
        }
      });
  });
}





//table inside a jumbotron






// ### Challenge #2: Manager View (Next Level)

// * Create a new Node application called `bamazonManager.js`. Running this application will:

//   * List a set of menu options:

//     * View Products for Sale
    
//     * View Low Inventory
    
//     * Add to Inventory
    
//     * Add New Product

//   * If a manager selects `View Products for Sale`, the app should list every available item: the item IDs, names, prices, and quantities.

// * If a manager selects `View Low Inventory`, then it should list all items with an inventory count lower than five.

// * If a manager selects `Add to Inventory`, your app should display a prompt that will let the manager "add more" of any item currently in the store.

// * If a manager selects `Add New Product`, it should allow the manager to add a completely new product to the store.

// - - -

// * If you finished Challenge #2 and put in all the hours you were willing to spend on this activity, then rest easy! Otherwise continue to the next and final challenge.
