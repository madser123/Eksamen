/*
 * GLOBAL VARIABLES
 */
var mysql = require("mysql");

var numRows;
var result;

/*
 * CONNECTION SETUP
 */

var connection = mysql.createConnection({
  host      :"localhost",
  user      :"root",
  password  :"",
  database  :"db",
});

function conn(sql) {
  connection.query(sql, (error, results, field) => {
    if (error) {
      return console.error(error.message);
    }
    result = results;
    numRows = results.length;
  })
  return new Promise(resolve => {
    resolve('resolved');
  });
};

/*
 * DATABASE REQUESTS
 */

function createAll() {
  createDB();
  createUserTable();
  createInterestsTable();
  createJunctionTable();
};

async function createDB() {
  await conn("CREATE DATABASE db");
};

async function createUserTable() {
  await conn("CREATE TABLE users (ID int UNSIGNED AUTO_INCREMENT primary key, firstName VARCHAR(99), lastName VARCHAR(99), email VARCHAR(99), userName VARCHAR(99), password VARCHAR(99), filter FLOAT, role FLOAT)");
};

async function createInterestsTable() {
  await conn("CREATE TABLE interests (ID int UNSIGNED AUTO_INCREMENT primary key, name VARCHAR(99))");
};

async function createJunctionTable() {
  await conn("CREATE TABLE junction (ID int AUTO_INCREMENT primary key,interestID INT UNSIGNED, userID INT UNSIGNED,FOREIGN KEY (interestID) REFERENCES interests(ID),FOREIGN KEY (userID) REFERENCES users(ID))");
};

async function deleteDB() {
  await conn("DROP DATABASE db");
};

/*
 * FUNCTIONS
 */

async function createUser() {

  if(validateForm("register")) {
    var firstName = document.getElementsByName("firstName")[0].value;
    var lastName = document.getElementsByName("lastName")[0].value;
    var email = document.getElementsByName("email")[0].value;
    var userName = document.getElementsByName("userName")[0].value;
    var password = document.getElementsByName("password")[0].value;
    var filter = 1;
    var role = 0;

    await conn

    if(doesUserExist(userName, email)) {
      await conn("INSERT INTO users (`firstName`, `lastname`, `email`, `userName`, `password`, `filter`, `role`) VALUES ('"+firstName+"', '"+lastName+"', '"+email+"', '"+userName+"', '"+password+"', '"+filter+"', '"+role+"')");
      console.log("Registration complete")
    } else {
      console.log("User already exists")
    }
  } else {
    console.log("Registration error")
  }
}

function validateForm(form) {
  var fields = ["firstName", "lastName", "email", "userName", "password"]
  var i, l = fields.length;
  var fieldname;

  for (i = 0; i < l; i++) {
    fieldname = fields[i];

    if (document.forms[form][fieldname].value === "") {
      alert(fieldname + " can not be empty");
      return false;
    }
  }
  return true;
}
