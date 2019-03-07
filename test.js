// TESTING ENVIROMENT

function consoleTest() {
  return true;
}

// VARIABLES
var numRows;
var result;

var mysql = require('mysql');


var connection = mysql.createConnection({
  host        : 'localhost',
  user        : 'root',
  password    : '',
  database    : 'db'
})
// FUNCTIONS
function conn(sql) {
  connection.query(sql, (error, results, field) => {
    if (error) {
      return console.error(error.message);
    }
    console.log(results);
    console.log(results.length);
    result = results;
    numRows = results.length;
    console.log("query executed");
  })
  return new Promise(resolve => {
    resolve('resolved');
  });
};

function connTest() {
  let sql = 'SELECT * FROM users';
  conn(sql);
};

function test() {
  var text = document.getElementById("text").value;
  var field = document.getElementById("field").value;
  var selection = document.getElementById("selection").value;

  if(selection === 1) {
    connTest();
  } else {
    comparisonTest(field, text);
  }
};

async function comparisonTest(field, string) {
  var sql = "SELECT * FROM db.users WHERE ?? = ?";
  var inserts = [field, string];
  sql = mysql.format(sql, inserts);

  console.log("FIELD: "+field);
  console.log("STRING: "+string);

  document.getElementById("testBox").innerHTML = "SQL: " + sql + "<br>";

  await conn(sql);

  displayValues();
};

function displayValues() {
  document.getElementById("testBox").innerHTML += "numRows: " + numRows;
  document.getElementById("testBox").innerHTML += "<br>ID: " + result[0]["ID"];
  document.getElementById("testBox").innerHTML += "<br>email: " + result[0]["email"];
  document.getElementById("testBox").innerHTML += "<br>Name: " + result[0]["firstName"] + " " + result[0]["lastName"];
  document.getElementById("testBox").innerHTML += "<br>userName: " + result[0]["userName"];
  document.getElementById("testBox").innerHTML += "<br>password: " + result[0]["password"];
};
