<?php

/* Debug I/O swtich */
$GLOBALS['debug'] = true;

if($GLOBALS['debug']){
  echo "<br>DEBUG: dbCluster included.<br>";
}

/* Variables */
$connPreDB      = new mysqli("localhost", "root", "");
$connPostDB     = mysqli_connect("localhost", "root", "", "eksamen");

/*
 * Funktion til at oprette alt i databasen.
 */
function createAll() {

  global $connPreDB, $connPostDB;

if ($GLOBALS['debug']){
  if($connPreDB->connect_error) {
    die("<br>DEBUG: Connection not achieved" . $conn->connect_error . "<br>")
  }
  echo "<br>DEBUG: Connection Achieved.<br>";
}

createDB($connPreDB);
createUserTable($connPostDB);

return;
};

/*
 * Funktion til at oprette database.
 */
function createDB($conn) {

  $sql = "CREATE DATABASE eksamen";
  $query = $conn->query($sql);

  if($GLOBALS['debug']){
    if($DBRequest) {
      echo "<br>DEBUG: DB Created.<br>";
    } else {
      echo "<br>DEBUG: DB Creation Error: " . $conn->error . "<br>"
    }
  }

};

function createUserTable($conn) {

  $sql = "CREATE TABLE users (
    ID int UNSIGNED AUTO_INCREMENT primary key,
    firstName VARCHAR(99),
    lastName VARCHAR(99),
    email VARCHAR(99),
    userName VARCHAR(99),
    password VARCHAR(99),
    filter FLOAT
  )";
  $query = $conn->query($sql);

  if($GLOBALS['debug']) {
    if($query) {
      echo "<br>DEBUG: Table 'users' Created.<br>";
    } else {
      echo "<br>DEBUG: Creation of Table 'users' Error: " . $conn->error . "<br>"
    }
  }

};

function createInterestsTable($conn) {

  $sql = "CREATE TABLE interests (
    ID int UNSIGNED AUTO_INCREMENT primary key,
    name VARCHAR(99)
  )";
  $query = $conn->query($sql);

  if($GLOBALS['debug']) {
    if($query) {
      echo "<br>DEBUG: Table 'interests' Created.<br>";
    } else {
      echo "<br>DEBUG: Creation of Table 'interests' Error: " . $conn->error . "<br>"
    }
  }

};

function createJunctionTable($conn) {

  $sql = "CREATE TABLE junction (
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
      echo "<br>DEBUG: Creation of Table 'junction' Error: " . $conn->error . "<br>"
    }
  }

};

/*
 * DATABASE REQUESTS
 */
function createUser($conn, $firstName, $lastName, $email, $userName, $password, $filter) {

  $sql = "INSERT INTO users (`firstName`, `lastName`, `email`, `userName`, `password`, `filter`)
  VALUES ('$firstName', '$lastName', '$email', '$userName', '$password', '$filter')";
  $query = $conn->query($sql);

  if($GLOBALS['debug']) {
    if($query) {
      echo "<br>DEBUG: User '" . $userName . "' created.<br>";
    } else {
      echo "<br>DEBUG: User not created. Error: " . $conn->error . "<br>"
    }
  }

};

function deleteUser($conn, $userID) {

  global $connPostDB;

  $sql = "";
};

function addInterest($conn, $interestID, $userID) {

  global $connPostDB;

  $sql = "INSERT INTO junction (`interstID`, `userID`)
  VALUES ('$interestID', '$userID')";
  $query = $conn->query($sql);

  if($GLOBALS['debug']) {
    if($query) {
      echo "<br>DEBUG: Interest (ID: " . $inerestID . ") added to user (ID: " . $userID . ")<br>";
    }
    echo "<br>DEBUG: Problem with adding interest (ID: " . $inerestID . ") to user (ID: " . $userID . ")";
    echo "<br>Error: " . $conn->error . "<br>";
  }

};

function removeInterest() {

  global $connPostDB;

  $sql = "";

};


/*
 * LOGINSYSTEM
 */
function verifyUser($userName, $password) {

global $connPostDB;

  if(verifyUsername($connPostDB, $userName)){
    if(verifyUsernameAndPassword($connPostDB, $userName, $password)){
        getUserDataAndLogIn($connPostDB, $userName)
    } else {
      if($GLOBALS['debug']){
        echo "Something went wrong. Not logged in.";
      } else {
        /* CALL JAVASCRIPT FUNC */
      }
    }
    if($GLOBALS['debug']) {
      echo "Something went wrong. Not logged in.";
    }
  } else {
    /* CALL JAVASCRIPT FUNC */
  }
};

function verifyUsername($conn, $userName) {

  $sql = "SELECT * FROM users WHERE navn='" . $userName . "' LIMIT 1";
  $result = $conn->query($sql);
  $row = $result->fetch_assoc();

  if($GLOBALS['debug']) {
    echo "<br>Check if user: '" . $userName . "' exists in DB."
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

  $sql = "SELECT ID FROM users WHERE password = '" . $password . "' AND userName = '" . $userName . "' LIMIT 1";
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

function getUserDataAndLogIn($conn, $userName) {
  $sql = "SELECT * FROM users WHERE userName = '" . $userName . "'";
  $result = $conn->query($sql);
  $row = $result->fetch_assoc();

  sessionCheck();

  $_SESSION['ID']         = $row['ID'];
  $_SESSION['firstName']  = $row['firstName'];
  $_SESSION['lastName']   = $row['lastName'];
  $_SESSION['email']      = $row['email'];
  $_SESSION['userName']   = $row['userName'];
  $_SESSION['filter']     = $row['filter'];

  if($GLOBALS['debug']) {
    echo "<br>DEBUG: Session Variables Set<br>";
    echo "<a href='../dashboard/welcome.php'><button>Go to dashboard</button></a>";
  } else {
    header('Location: ../dashboard/welcome.php');
  }

};

/*
 * SESSIONCHECKER
 */
function sessionCheck() {
  if(session_id() == '' || !isset($_SESSION)) {
    session_start();
    if($GLOBALS['debug']) {
      echo "<br>DEBUG: Session Started<br>";
    }
    return TRUE;
  } else {
    echo "<br>DEBUG: Session Running<br>";
    return FALSE;
  }
};
 ?>
