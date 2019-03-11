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
    console.log(result);
  });
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('resolved');
    }, 100);
  });
};

/*
 * DATABASE SETUP
 */
 async function createAll() {
   await createDB();
   await createUserTable();
   await createInterestsTable();
   await createJunctionTable();
   return true;
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

/*
 * ucFirst() gør så det første tegn i en string bliver til et uppercase.
 *
 * Eksempel:
 *
 * ucFirst("hello world") => "Hello world"
 *
 */

 function ucFirst(string) {
     return string.charAt(0).toUpperCase() + string.slice(1);
 }

 /*
  * createUser() denne funktion står for at anskaffe og sammenligne data
  * så at der ikke bliver oprettet 2 identiske brugere.
  *
  */

async function createUser() {
  document.getElementById("formWarning").innerHTML = "";

  if(validateForm("register")) {
    var firstName = document.getElementsByName("firstName")[0].value;
    var lastName  = document.getElementsByName("lastName")[0].value;
    var email     = document.getElementsByName("email")[0].value;
    var userName  = document.getElementsByName("userName")[0].value;
    var password  = document.getElementsByName("password")[0].value;
    let filter    = 1;
    let role      = 0;

    firstName = ucFirst(firstName);
    lastName  = ucFirst(lastName);

    if(await doesUserExist(userName, email)) {
      console.log("User already exist.");
      document.getElementById("formWarning").innerHTML = "* User already exist";
    } else {
      console.log("Registration complete");
      conn("INSERT INTO users (`firstName`,`lastname`,`email`,`userName`,`password`,`filter`,`role`) VALUES ('"+firstName+"','"+lastName+"','"+email+"','"+userName+"','"+password+"','"+filter+"','"+role+"')");
    }
  } else {
    console.log("Form field empty");
  }
};

/*
 * doesUserExist() checker om et brugernavn og en email allerede kan findes i databasen.
 *
 * Funktionen bliver somregelt brugt i sammenhæng med createUser().
 */

async function doesUserExist(user, email) {
  var sql     = "SELECT * FROM db.users WHERE ?? = ?";
  var inserts = ["userName", user];
  sql         = mysql.format(sql, inserts);

  var connResult = await conn(sql);

  var dbUserName;
  var dbEmail;

 if(typeof result != "undefined" && result != null && result.length != null && result.length > 0){
    dbUserName = result[0]["userName"];
    dbEmail    = result[0]["email"];
  }

  if(compare(dbUserName, user)) {
    if(compare(dbEmail, email)) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};

/*
 * compare() sammenligner to values.
 *
 * Eksempel:
 *
 * compare(1, 2) = FALSE
 *
 * compare('hej', 'hej') = TRUE
 */

function compare(a, b) {
  if(a === b) {
    return true;
  } else {
    return false;
  }
};

/*
 * validateForm() tjekker om alle felter i en html <form> er udfyldt.
 *
 * form = formens navn i html
 *
 * HTML:
 * <form name='foo'>
 *
 * JS:
 * validateForm('foo');
 */

function validateForm(form) {
  var fields = ["email", "firstName", "lastName", "userName", "password"];
  var i, l   = fields.length;

  var fieldname;
  var fieldPlaceholder;

  for (i = 0; i < l; i++) {
    fieldname = fields[i];
    fieldPlaceholder = document.forms[form][fieldname].placeholder;

    if (document.forms[form][fieldname].value === "") {
      document.getElementById("formWarning").innerHTML = "* " + fieldPlaceholder + " can not be empty";
      return false;
    }
  }
  return true;
};
