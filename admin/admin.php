<?php
session_start();

include "../script/dbCluster.php";
include "../script/adminCluster.php";

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
        <div id="searchResult">
          <table border="0" cellspacing="2" cellpadding="2">
            <tr>
              <td>
                <b>ID</b>
              </td>
              <td>
                <b>Name</b>
              </td>
              <td>
                <b>Email</b>
              </td>
              <td>
                <b>Username</b>
              </td>
              <td>
                <b>Filter</b>
              </td>
              <td>
                <b>Role</b>
              </td>
            </tr>
            <?php
              if(isset($_POST['searchValue'])) {
                $search = $_POST['searchValue'];

                $search_sql = "SELECT * FROM db.users WHERE userName LIKE '%$search%'";
                $search_result = $conn->query($search_sql);

                if($GLOBALS['debug']) {
                  echo "<br>DEBUG: Search query: " . $search . "<br>";
                }

                if($search_result->num_rows > 0) {
                  while($row=$search_result->fetch_assoc()) {
                    $search_ID = $row['ID'];
                    $search_firstName = $row['firstName'];
                    $search_lastName = $row['lastName'];
                    $search_email = $row['email'];
                    $search_userName = $row['userName'];
                    $search_filter = $row['filter'];
                    $search_role = $row['role'];

                    $search_name = $search_firstName . " " . $search_lastName;
                    ?>
                    <tr>
                      <td>
                        <b><?php echo $search_ID; ?></b>
                      </td>
                      <td>
                        <b><?php echo $search_name; ?></b>
                      </td>
                      <td>
                        <b><?php echo $search_email; ?></b>
                      </td>
                      <td>
                        <b><?php echo $search_userName; ?></b>
                      </td>
                      <td>
                        <b><?php echo $search_filter; ?></b>
                      </td>
                      <td>
                        <b><?php echo $search_role; ?></b>
                      </td>
                    </tr>
                    <?php
                  }
                } else {
                  echo "No results found";
                  if($GLOBALS['debug']) {
                    echo "<br>DEBUG: Error: " . $conn->error;
                  }
                }
              } else {
                if($GLOBALS['debug']) {
                  echo "<br>DEBUG: No search query set <br>";
                }
              }
                ?>
              </div>
            </div>
    </section>
    <footer id="footer">
    </footer>
  </body>
</html>
