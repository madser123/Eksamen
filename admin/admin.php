<?php
session_start();

include "../script/dbCluster.php";
include "../script/adminCluster.php";

if (isset($_POST['searchValue'])) {
  if($GLOBALS['debug']) {
    searchDB($_POST['searchValue']);
  } else {
    searchDB($_POST['searchValue']);
  }
};

$sql = "SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = 'eksamen'";
$query = $conn->query($sql);

if($GLOBALS['debug']) {
  error_reporting(E_ALL);
} else {
  error_reporting(0);
}

?>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <link rel="stylesheet" href="../css/main.css">
    <title>ADMIN PAGE</title>
  </head>
  <body>
    <header id="header">
      <span class="pageTitle">ADMIN PAGE</span>
    </header>
    <section id="content">
      <br>
      <span class="h1">DATABASE OPTIONS</span>
      <br>
      <br>
      <div class="DBstatus">
        <span>Database status: </span>
        <?php
        if(doesDBExist("db")) {
          echo "<span style='color: #00FF0E;'>Created";
        } else {
          echo "<span style='color: #FF0000;'>Not Created";
        }
        ?>
        </span>
      </div>
      <br>
      <form action="../script/adminCluster.php" method="post">
        <label class="formtext">Generate DB:</label>
        <input class="input" type="submit" name="createDB" value="Create"><br>
        <label class="formText">Delete DB:</label>
        <input class="input" type="submit" name="deleteDB" value="Delete"><br>
      </form>
      <br>
      <br>
      <div id="searchDB">
        <span class="h2">Search Database</span>
        <form action="admin.php" method="post">
          <input class="input" type="text" name="searchValue">
          <input class="input" type="submit" name="search">
        </form>
        <?php
        function searchDB($search) {

          global $conn;

          $sql = "SELECT * FROM db.users WHERE username LIKE '%$search%'";
          $result = $conn->query($sql);
          $row = $result->fetch_assoc();
          $num = $result->num_rows;

          if($GLOBALS['debug']) {
            echo "<br>DEBUG: Search query: " . $search . "<br>";
            echo "DEBUG: Number of results: " . $num . "<br>";
          }

          $temp = array();

          if($result) {
            for($i = 0; $i <= $result->num_rows; $i++) {
              array_push($temp, $row['ID']);
            }
            $_SESSION['search'] = $temp;
            echo "DEBUG: Index 0: " . $_SESSION['search'][0] . "<br>";
          } else {
            echo "<br>DEBUG: Error during search: " . $conn->error . "<br>";
          };
        ?>
        <div id="searchResult">
        </div>
        <?php
        };
        ?>
      </div>
    </section>
    <footer id="footer">
    </footer>
  </body>
</html>
