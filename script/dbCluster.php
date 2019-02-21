<?php

/* Debug I/O swtich */
$GLOBALS['debug'] = true;

if($GLOBALS['debug']){
  echo "<br>DEBUG: dbCluster included.<br>";
}

/* Variables */
$conn = mysqli_connect("localhost", "root", "");

/*
 * Funktion til at oprette alt i databasen.
 */
function createAll() {

  global $conn;

if ($GLOBALS['debug']){
  if($conn->connect_error) {
    die("<br>DEBUG: Connection not achieved" . $conn->connect_error . "<br>");
  }
  echo "<br>DEBUG: Connection Achieved.<br>";
}

createDB($conn);
createUserTable($conn);
createInterestsTable($conn);
createJunctionTable($conn);

return;
};

/*
 * Funktioner til at oprette database.
 */
function createDB($conn) {

  $sql = "CREATE DATABASE db";
  $query = $conn->query($sql);

  if($GLOBALS['debug']){
    if($query) {
      echo "<br>DEBUG: DB Created.<br>";
    } else {
      echo "<br>DEBUG: DB Creation Error: " . $conn->error . "<br>";
    }
  }
};

function createUserTable($conn) {

  $sql = "CREATE TABLE db.users (
    ID int UNSIGNED AUTO_INCREMENT primary key,
    firstName VARCHAR(99),
    lastName VARCHAR(99),
    email VARCHAR(99),
    userName VARCHAR(99),
    password VARCHAR(99),
    filter FLOAT,
    role FLOAT
  )";
  $query = $conn->query($sql);

  if($GLOBALS['debug']) {
    if($query) {
      echo "<br>DEBUG: Table 'users' Created.<br>";
    } else {
      echo "<br>DEBUG: Creation of Table 'users' Error: " . $conn->error . "<br>";
    }
  }
};

function createInterestsTable($conn) {

  $sql = "CREATE TABLE db.interests (
    ID int UNSIGNED AUTO_INCREMENT primary key,
    name VARCHAR(99)
  )";
  $query = $conn->query($sql);

  if($GLOBALS['debug']) {
    if($query) {
      echo "<br>DEBUG: Table 'interests' Created.<br>";
    } else {
      echo "<br>DEBUG: Creation of Table 'interests' Error: " . $conn->error . "<br>";
    }
  }
};

function createJunctionTable($conn) {

  $sql = "CREATE TABLE db.junction (
    ID int AUTO_INCREMENT primary key,
    interestID INT UNSIGNED,
    userID INT UNSIGNED,
    FOREIGN KEY (interestID) REFERENCES interests(ID),
    FOREIGN KEY (userID) REFERENCES users(ID)
  )";
  $query = $conn->query($sql);

  if($GLOBALS['debug']) {
    if($query) {
      echo "<br>DEBUG: Table 'junction' Created.<br>";
    } else {
      echo "<br>DEBUG: Creation of Table 'junction' Error: " . $conn->error . "<br>";
    }
  }
};

function deleteDB() {

  global $conn;

  $sql = "DROP DATABASE db";
  $query = $conn->query($sql);

  if($GLOBALS['debug']) {
    echo "<br>DEBUG: Dropping database. <br>";
    if($query){
      echo "<br>DEBUG: Database deleted. <br>";
    } else {
      echo "<br>DEBUG: Error during deletion of database. " . $conn->error . "<br>";
    }
  }
}

/*
 * DATABASE REQUESTS
 */
function createUser($firstName, $lastName, $email, $userName, $password, $filter, $role) {

  global $conn;

  if(doesUserExist($conn, $userName, $email)){

    $sql = "INSERT INTO db.users (`firstName`, `lastName`, `email`, `userName`, `password`, `filter`, `role`)
    VALUES ('$firstName', '$lastName', '$email', '$userName', '$password', '$filter', '$role')";
    $query = $conn->query($sql);

    if($GLOBALS['debug']) {
      if($query) {
        echo "<br>DEBUG: User '" . $userName . "' created.<br>";
      } else {
        echo "<br>DEBUG: User not created. Error: " . $conn->error . "<br>";
      }
    }
  }
};

function doesUserExist($conn, $userName, $email) {
  if(nameCheck($conn, $userName)) {
    if(emailCheck($conn, $email)) {
      return true;
    } else {
      echo "Email already in use.";
      return false;
    }
  } else {
    echo "Username already in use.";
    return false;
  }

};

function nameCheck($conn, $userName) {

  $sql = "SELECT * FROM db.users WHERE userName LIKE '%$userName%'";
  $result = $conn->query($sql);

  if($result->num_rows > 0) {
    return true;
  } else {
    return false;
  }
};

function emailCheck($conn, $email) {

  $sql = "SELECT * FROM db.users WHERE email LIKE '%$email%'";
  $result = $conn->query($sql);

  if($result->num_rows > 0) {
    return true;
  } else {
    return false;
  }
};

function deleteUser($userID) {

  global $conn;

  $sql = "DELETE FROM db.users WHERE ID='" . $userID . "'";
  $query = $conn->query($sql);

  if($GLOBALS['debug']) {
    if($query) {
      echo "<br>DEBUG: User (ID: " . $userID . ") deleted.<br>";
    } else {
      echo "<br>DEBUG: User (ID: " . $userID . ") not deleted. Error: " . $conn->error . "<br>";
    }
  }
};

function addInterest($interestID, $userID) {

  global $conn;

  $sql = "INSERT INTO db.junction (`interestID`, `userID`)
  VALUES ('$interestID', '$userID')";
  $query = $conn->query($sql);

  if($GLOBALS['debug']) {
    if($query) {
      echo "<br>DEBUG: Interest (ID: " . $inerestID . ") added to user (ID: " . $userID . ")<br>";
    } else {
      echo "<br>DEBUG: Problem with adding interest (ID: " . $inerestID . ") to user (ID: " . $userID . ")";
      echo "<br>Error: " . $conn->error . "<br>";
    }
  }
};

function removeInterest($userID, $interestID) {

  global $conn;

  $sql = "DELETE FROM db.junction WHERE interestID='" . $interestID . "' userID='" . $userID . "'";
  $query = $conn->query($sql);

  if($GLOBALS['debug']) {
    if($query) {
      echo "<br>DEBUG: Interest (ID: " . $interestID . ") deleted from user (ID: " . $userID . ")";
    } else {
      echo "<br>DEBUG: Interest (ID: " . $interestID . ") not deleted from user (ID: " . $userID . "). Error: " . $conn->error . "<br>";
    }
  }
};

/*
 * LOGINSYSTEM
 */
function verifyUser($userName, $password) {

global $conn;

  if(verifyUsername($conn, $userName)){
    if(verifyUsernameAndPassword($conn, $userName, $password)){
        fetchUserDataAndLogIn($conn, $userName);
        /* CALL JAVASCRIPT FUNC */
    } else {
      if($GLOBALS['debug']){
        echo "Something went wrong. Not logged in.";
      }
    }
      /* CALL JAVASCRIPT FUNC */
  } else {
    if($GLOBALS['debug']) {
      echo "Something went wrong. Not logged in.";
    }
  }
};

function verifyUsername($conn, $userName) {

  $sql = "SELECT * FROM db.users WHERE userName='" . $userName . "' LIMIT 1";
  $result = $conn->query($sql);
  $row = $result->fetch_assoc();

  if($GLOBALS['debug']) {
    echo "<br>Check if user: '" . $userName . "' exists in db.";
    echo "<br> RESULT: ";

    if($row !=null ? TRUE : FALSE) {
      echo "User '" . $userName . "' exists<br>";
    } else {
      echo "User '" . $userName . "' doesn't exist. Error: " . $conn->error . "<br>";
    }
  }

  return $row !=null ? TRUE : FALSE;
};

function verifyUsernameAndPassword($conn, $userName, $password) {

  $sql = "SELECT ID FROM db.users WHERE password = '" . $password . "' AND userName = '" . $userName . "' LIMIT 1";
  $result = $conn->query($sql);
  $row = $result->fetch_assoc();

  if($GLOBALS['debug']) {
    echo "<br>Check if User + Pass exists. <br>Username: '" . $userName .  "' <br>Password:'" . $password . "'";
    echo "<br>RESULT: ";

    if($row !=null ? TRUE : FALSE) {
      echo "User '" . $userName . "' with Password: '" . $password . "' exists<br>";
    } else {
      echo "User '" . $userName . "' with Password: '" . $password . "' doesn't exist. Error: " . $conn->error . "<br>";
    }
  }
return $row != null ? TRUE : FALSE;
};

function fetchUserDataAndLogIn($conn, $userName) {

  if(sessionCheck()) {
    session_unset();
    session_destroy();
  }

  session_start();

  fetchUserData($conn, $userName);

  if($GLOBALS['debug']) {
    if(isset($_SESSION['ID'])) {
      echo "<br>DEBUG: Session variables NOT set";
      echo "<br><a href='../dashboard/welcome.php'><button>Go to dashboard</button></a><br>";
    } else {
      echo "<br>DEBUG: Session Variables Set";
      echo "<br><a href='../dashboard/welcome.php'><button>Go to dashboard</button></a><br>";
    }
  } else {
    header('Location: ../dashboard/welcome.php');
  }
};

function fetchUserData($conn, $userName) {
  $sql = "SELECT * FROM db.users WHERE userName = '" . $userName . "'";
  $result = $conn->query($sql);
  $row = $result->fetch_assoc();

  $_SESSION['ID'] = $row['ID'];
  $_SESSION['firstName'] = $row['firstName'];
  $_SESSION['lastName'] = $row['lastName'];
  $_SESSION['email'] = $row['email'];
  $_SESSION['userName'] = $row['userName'];
  $_SESSION['filter'] = $row['filter'];
  $_SESSION['role'] = $row['role'];


  if($GLOBALS['debug']) {
    echo "DEBUG: SESSION VARIABLES<br>";
    echo "DEBUG: ID:        " . $_SESSION['ID'] . "<br>";
    echo "DEBUG: firstName: " . $_SESSION['firstName'] . "<br>";
    echo "DEBUG: lastName:  " . $_SESSION['lastName'] . "<br>";
    echo "DEBUG: email:     " . $_SESSION['email'] . "<br>";
    echo "DEBUG: userName:  " . $_SESSION['userName'] . "<br>";
    echo "DEBUG: filter:    " . $_SESSION['filter'] . "<br>";
    echo "DEBUG: role:      " . $_SESSION['role'] . "<br>";
  }
};

function doesDBExist($DBName) {

  $conn = mysqli_connect("localhost", "root", "", $DBName);

  if(!$conn) {
    return FALSE;
  } else {
    return TRUE;
  }
};

/*
 * SESSIONCHECKER
 */
function sessionCheck() {
  if(session_id() == '' || !isset($_SESSION)) {
    if($GLOBALS['debug']) {
      echo "<br>DEBUG: Session not running<br>";
    }
    return FALSE;
  } else {
    if($GLOBALS['debug']) {
      echo "<br>DEBUG: Session running<br>";
    }
    return TRUE;
  }
};
 ?>
