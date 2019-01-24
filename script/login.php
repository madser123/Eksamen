<?php

include "dbCluster.php";

$userName = $_POST['userName'];
$password = $_POST['password'];

echo "login.php : username=" . $userName . " : password=" . $password;

verifyUser($userName, $password);

 ?>
