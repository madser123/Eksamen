<?php
include "../script/userVars.php";
include "../script/dbCluster.php";

?>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title><?php echo $username; ?>'s Profile </title>
  </head>
  <body>
    <header>

    </header>
    <section id="content">
      <div id="profile">
        <div class="userPicture">
        </div>
        <div class="userInfo">
          <span>Email: <?php echo $sEmail; ?></span><br>
          <span>Username: <?php echo $sUserName; ?></span><br>
          <span>Name: <?php echo $sFullName; ?></span><br>
          <span>Role: <?php echo $sRole; ?></span><br>
          <span>Interests: <?php echo $sInterests; ?></span><br>
        </div>
      </div>
    </section>
    <footer>

    </footer>
  </body>
</html>
