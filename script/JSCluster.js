/*
 * GLOBAL VARIABLES
 */

const storage  = require("electron-json-storage");
const mysql    = require("mysql");
const electron = require("electron");
const remote   = require("electron").remote;

const mainProcess = require("electron").remote.require("./main.js");

const defaultDataPath = storage.getDefaultDataPath();

var numRows;
var result;

var window;

storage.get('user', function(error, object) {
  if (error) throw error;
  if (object.hasOwnProperty('autoLogin')) {
    console.log("User defined");
    user = object;
    console.log(object);
  } else {
    console.log("User not defined");
  }
});

/*
 * CONNECTION SETUP
 */

var connection = mysql.createConnection({
  host      :"localhost",
  user      :"root",
  password  :"",
  database  :"db"
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
   await createInterestJunctionTable();
   await createFriendsJunctionTable();
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

async function createInterestJunctionTable() {
  await conn("CREATE TABLE interestJunction (ID int AUTO_INCREMENT primary key, interestID INT UNSIGNED, userID INT UNSIGNED, FOREIGN KEY (interestID) REFERENCES interests(ID), FOREIGN KEY (userID) REFERENCES users(ID))");
};

async function createFriendsJunctionTable()  {
  await conn("CREATE TABLE friendshipJunction (ID int AUTO_INCREMENT primary key, user1ID INT UNSIGNED, user2ID INT UNSIGNED, FOREIGN KEY (user1ID) REFERENCES users(ID), FOREIGN KEY (user2ID) REFERENCES users(ID))")
};

async function deleteDB() {
  await conn("DROP DATABASE db");
};


/*
 * FUNCTIONS
 */

// DATABASE REQUESTS //

/*
 * deleteUser()
 */

async function deleteUser(userID) {
  var sql     = "DELETE FROM db.users WHERE ?? = ?";
  var inserts = ["ID", userID];
  sql         = mysql.format(sql, inserts);

  if(alert('Are you sure you want to delete this account?')) {
    var connResult = await conn(sql);

  } else {
    console.log('Account deletion aborted.');

  }
};


/*
 * addInterest()
 */

async function addInterest(interestID, userID) {
  var sql     = "INSERT INTO db.junction (`interestID`, `userID`) VALUES (??, ?)";
  var inserts = [interestID, userID];
  sql         = mysql.format(sql, inserts);

  await conn(sql);

  console.log('Interest added');
};


/*
 * removeInterest()
 */

async function removeInterest(interestID, userID) {
  var sql     = "DELETE FROM db.junction WHERE ?? = ?? ?? = ?";
  var inserts = ["interestID", interestID, "userID", userID];
  sql         = mysql.format(sql, inserts);

  await conn(sql);

  console.log("interest removed");
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
 * fetchUserData()
 */

async function fetchUserData(userName) {
  var sql = "SELECT * FROM db.users WHERE ?? = ?";
  var inserts = ["userName", userName];
  sql = mysql.format(sql, inserts);

  connResult = await conn(sql);

  await getUser(userName);
};

// STORAGE MANAGEMENT //

/*
 * storeUser()
 */

function storeUser(connResult, autologin) {
  if(connResult === 'resolved') {
    if(autoLogin === true) {
      console.log('autoLogin: True')
      storage.set('user', {
        id       : result[0]["ID"],
        firstName: result[0]["firstName"],
        lastName : result[0]["lastName"],
        email    : result[0]["email"],
        userName : result[0]["userName"],
        filter   : result[0]["filter"],
        role     : result[0]["role"],
        autoLogin: autologin
      }, function(error) {
        if (error) throw error;
      });
    } else {
      storage.set(result[0]["userName"], {
        id       : result[0]["ID"],
        firstName: result[0]["firstName"],
        lastName : result[0]["lastName"],
        email    : result[0]["email"],
        userName : result[0]["userName"],
        filter   : result[0]["filter"],
        role     : result[0]["role"]
      }, function(error) {
        if (error) throw error;
      });
    }
  }
};

/*
 * getUser()
 */

function getUser(userName) {
  storage.get(userName, function(error, object) {
    if (error) throw error;
    user = object;
  });
};

/*
 * removeUser()
 */

function removeUser(userName) {
  storage.remove(userName, function(error) {
    if (error) throw error;
  user = "";
  });
}

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
  switch(form) {
    case "login":
      var fields = ["userName", "password"];
      break;

    case "register":
      var fields = ["email", "firstName", "lastName", "userName", "password"];
      break;
  }

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
 * ucFirst() gør så det første tegn i en string bliver til et uppercase.
 *
 * Eksempel:
 *
 * ucFirst("hello world") = "Hello world"
 *
 */

 function ucFirst(string) {
     return string.charAt(0).toUpperCase() + string.slice(1);
 }
