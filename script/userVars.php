<?php
/*
 * Session-variabler med brugerdata.
 */
session_start();
$ID = $_SESSION['ID'];
$firstName = $_SESSION['firstName'];
$lastName = $_SESSION['lastName'];
$email = $_SESSION['email'];
$userName = $_SESSION['userName'];
$filter = $_SESSION['filter'];
$role = $_SESSION['role'];

$fullName = $firstName . " " . $lastName;

/* Check current user for admin role */
if($role === 'admin') {
  $admin = true;
} else {
  $admin = false;
};

 ?>
