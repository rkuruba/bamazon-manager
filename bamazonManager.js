let mysql = require("mysql");
let inquirer = require("inquirer");

// create the connection information for the sql database
let connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "cloud12s",
  database: "bamazon"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  start();
});

const start = function () {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View Products for Sale",
        "View Low Inventory",
        "Add to Inventory",
        "Add New Product"
      ]
    })
    .then(function(answer) {
      switch (answer.action) {
      case "View Products for Sale":
        viewProducts();
        break;
      case "View Low Inventory":
        viewLowInventory();
        break;
      case "Add to Inventory":
        addToInventory();
        break;

      case "Add New Product":
        addProduct();
        break;
      }
     
    });
}

const viewProducts = function() {
  connection.query("SELECT * FROM products", function(err, results) {
    if (err) throw err;
    for(i=0;i<results.length;i++)
    console.log(results[i].item_d, results[i].product_name, results[i].department_name, results[i].price, results[i].stock_quantity);
  });

}

const viewLowInventory = function() {
  connection.query("SELECT * FROM products where stock_quantity < 5", function(err, results) {
    if (err) throw err;
    for(i=0;i<results.length;i++)
    console.log(results[i].item_d, results[i].product_name, results[i].department_name, results[i].price, results[i].stock_quantity);
  });

}

const addToInventory = function() {
  inquirer
  .prompt([
    {
      name: "id",
      type: "input",
      message: "What is the id of the item you would like to add more?"
    },
    {
      name: "units",
      type: "input",
      message: "How many units you want to add more?"
    }
  ])
  .then(function(answer) {

    connection.query(`SELECT * FROM products where item_d = '${answer.id}'`, function(err, search) {
      if (err) throw err;

    connection.query( "UPDATE products SET ? WHERE ?",
          [
            {
              stock_quantity: (parseInt(search[0].stock_quantity) + parseInt(answer.units))
            },
            {
              item_d: answer.id
            }],
            function(error) {
              if (error) throw err;
            });
          });
  });
 
}

const addProduct = function() {
  inquirer
  .prompt([
    {
      name: "id",
      type: "input",
      message: "What is the id of the item you would like to add?"
    },
    {
      name: "name",
      type: "input",
      message: "What is the name of the item you would like to add?"
    },
    {
      name: "dept_name",
      type: "input",
      message: "What is the name of the department you would like to add item to?"
    },
    {
      name: "units",
      type: "input",
      message: "How many units you want to add?"
    },
    {
      name: "price",
      type: "input",
      message: "what is the price of the unit you want to add?"
    }
  ])
  .then(function(answer) {

    connection.query( `INSERT INTO products VALUES (${answer.id}, "${answer.name}", "${answer.dept_name}", ${answer.units}, ${answer.price}, 0)`,
            function(err) {
              if (err) throw err;
      });
      viewProducts();

  });

}
/*

// function which prompts the user for what action they should take
const start = function() {

  connection.query("SELECT * FROM products", function(err, results) {
    if (err) throw err;
    for(i=0;i<results.length;i++)
    console.log(results[i].item_d, results[i].product_name, results[i].department_name, results[i].price, results[i].stock_quantity);
  inquirer
    .prompt([
      {
        name: "id",
        type: "input",
        message: "What is the id of the item you would like to buy?"
      },
      {
        name: "units",
        type: "input",
        message: "How many units you want to buy?"
      }
    ])
    .then(function(answer) {
      connection.query(`SELECT * FROM products where item_d = '${answer.id}'`, function(err, search) {
        if (err) throw err;
        if((search[0].stock_quantity- answer.units) < 0)
        console.log('Insufficient quantity!');
        else
        {
          connection.query( "UPDATE products SET ? WHERE ?",
          [
            {
              stock_quantity: (search[0].stock_quantity - answer.units)
            },
            {
              item_d: answer.id
            }],
            function(error) {
              if (error) throw err;
            console.log(`Total cost of the purchase: ${search[0].price * answer.units}`)
            connection.query("SELECT * FROM products", function(err, results) {
              if (err) throw err;
              for(i=0;i<results.length;i++)
              console.log(results[i].item_d, results[i].product_name, results[i].department_name, results[i].price, results[i].stock_quantity);
            });
            connection.end();
          });
        }
      });
    });
  });
}*/
