<?php

include_once "dbCluster.php";

$email = $_POST['email'];
$firstName = ucfirst($_POST['firstName']);
$lastName = ucfirst($_POST['lastName']);
$userName = $_POST['userName'];
$password = $_POST['password'];
$filter = 1;
$role = 'Member';

createUser($firstName, $lastName, $email, $userName, $password, $filter, $role);

if($GLOBALS['debug']) {
  echo "<a href='../index.html'><button>Go back</button></a>";
} else {
  header("Location: ../index.html");
}

?>
