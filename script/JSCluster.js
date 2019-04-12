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
var friends;

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
   await createInterests();
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
  await conn("CREATE TABLE interestjunction (ID int AUTO_INCREMENT primary key, interestID INT UNSIGNED, userID INT UNSIGNED, FOREIGN KEY (interestID) REFERENCES interests(ID), FOREIGN KEY (userID) REFERENCES users(ID))");
};

async function createFriendsJunctionTable()  {
  await conn("CREATE TABLE friendshipjunction (ID int AUTO_INCREMENT primary key, user1ID INT UNSIGNED, user2ID INT UNSIGNED, FOREIGN KEY (user1ID) REFERENCES users(ID), FOREIGN KEY (user2ID) REFERENCES users(ID))")
};

async function createInterests() {
  var data = ["Gaming", "Movies", "Sports"];

  for(var i = 0; i < data.length; i++) {
    var sql     = "INSERT INTO db.interests (??) VALUES (?)";
    var inserts = ["name", data[i]];
    sql = mysql.format(sql, inserts);
    await conn(sql);
    console.log("Interest '" + data[i] + "' created");
  }
}

async function deleteDB() {
  await conn("DROP DATABASE db");
};


/*
 * FUNCTIONS
 */

// DATABASE REQUESTS //

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


async function addInterest(interestID, userID) {
  var sql     = "INSERT INTO db.interestjunction (??, ??) VALUES (?, ?)";
  var inserts = ["interestID", "userID", interestID, userID];
  sql         = mysql.format(sql, inserts);

  await fetchUserInterests();

  var a = 0;

  for (var i = 0; i < result.length; i++) {
    if(result[0]) {
      interest = result[0].interestID;
      if(compare(interestID, interest)) {
        a++;
        console.log("A: " + a);
      }
    }
  }

  if(a === 0) {
    await conn(sql);
    await pasteInterests();
    console.log("Added new interest");
    return connResult;

  } else {
    console.log("Interest already added");
    return false;

  }
};


async function removeInterest(interestID, userID) {
  var sql     = "DELETE FROM db.interestjunction WHERE ?? = ? AND ?? = ?";
  var inserts = ["interestID", interestID, "userID", userID];
  sql         = mysql.format(sql, inserts);

  connResult = await conn(sql);

  console.log(connResult);

  pasteInterests();

  return connResult;
};

async function fetchUserInterests() {
  var sql     = "SELECT * FROM db.interestjunction WHERE ?? = ?";
  var inserts = ["userID", user.id];
  sql         = mysql.format(sql, inserts);

  connResult = await conn(sql);

  console.log(connResult);

  return connResult;
};

async function fetchInterestData(id) {
  var sql     = "SELECT * FROM db.interests WHERE ?? = ?";
  var inserts = ["ID", id];
  sql         = mysql.format(sql, inserts);

  connResult = await conn(sql);

  return connResult;
}

async function fetchInterests() {
  var sql    = "SELECT * FROM db.interests";
  connResult = await conn(sql);
  return connResult;
}


async function fetchFriends() {
  var sql     = "SELECT * FROM db.friendshipjunction WHERE ?? = ?";
  var inserts = ["user1ID", user.id];
  sql         = mysql.format(sql, inserts);

  connResult = await conn(sql);

  console.log(connResult);

  return connResult;
};


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


async function fetchUserData(id) {
  var sql     = "SELECT * FROM db.users WHERE ?? = ?";
  var inserts = ["ID", id];
  sql         = mysql.format(sql, inserts);

  connResult = await conn(sql);

  console.log(connResult);

  return connResult;
};


// FRIENDS MANAGEMENT //

async function addFriend(id) {
  if (compare(user.id, id)) {
    console.log("You can't add yourself")
  } else {
    var sql     = "SELECT * FROM db.friendshipjunction WHERE ?? = ? AND ?? = ?";
    var inserts = ["user1ID", user.id, "user2ID", id];
    sql         = mysql.format(sql, inserts);

    connResult = await conn(sql);

    if (connResult === 'resolved')  {
      if (result.length > 0) {
        console.log(result[0].ID);
        console.log("already friends");
      } else {
        console.log("no data");
        var sql     = "INSERT INTO db.friendshipjunction (??, ??) VALUES (?, ?)";
        var inserts = ["user1ID", "user2ID", user.id, id];
        sql         = mysql.format(sql, inserts);

        connResult = await conn(sql);

        console.log(connResult);

        pasteFriends();

        return connResult;
      }
    } else {
      console.log("not resolved");
    }
  }
};


async function removeFriend(id) {
  var sql     = "DELETE FROM db.friendshipjunction WHERE ?? = ? AND ?? = ?";
  var inserts = ["user1ID", user.id, "user2ID", id];
  sql         = mysql.format(sql, inserts);

  connResult = await conn(sql);

  console.log(connResult);

  pasteFriends();

  return connResult;
};


// STORAGE MANAGEMENT //

async function storeUser(connResult, autoLogin) {
  if(connResult === 'resolved') {
    console.log(connResult);
    console.log(result);
    if(autoLogin === true) {
      console.log('autoLogin: True')
      await storage.set('user', {
        id       : result[0]["ID"],
        firstName: result[0]["firstName"],
        lastName : result[0]["lastName"],
        email    : result[0]["email"],
        userName : result[0]["userName"],
        filter   : result[0]["filter"],
        role     : result[0]["role"],
        autoLogin: autoLogin
      }, function(error) {
        if (error) throw error;
        console.log(result);
      });
    } else {
      await storage.set('user', {
        id       : result[0]["ID"],
        firstName: result[0]["firstName"],
        lastName : result[0]["lastName"],
        email    : result[0]["email"],
        userName : result[0]["userName"],
        filter   : result[0]["filter"],
        role     : result[0]["role"],
        autoLogin: autoLogin
      }, function(error) {
        if (error) throw error;
      });
    }
    storage.get('user', function(error, object) {
      if (error) throw error;
      user = object;
    });
  }
};


async function editAutologin(autoLogin) {
  await storage.set('user', {
    id       : user.id,
    firstName: user.firstname,
    lastName : user.lastname,
    email    : user.email,
    userName : user.userName,
    filter   : user.filter,
    role     : user.role,
    autoLogin: autoLogin
  }), function(error) {
    if(error) throw error;
  };

  storage.get('user', function(error, object) {
    if (error) throw error;
    user = object;
  });
};


function removeUser(userName) {
  storage.remove(userName, function(error) {
    if (error) throw error;
  user = "";
  });
};


// OTHER //

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


function compare(a, b) {
  if(a === b) {
    return true;
  } else {
    return false;
  }
};


 function ucFirst(string) {
     return string.charAt(0).toUpperCase() + string.slice(1);
 };
