<?php
  include_once "dbCluster.php";

  if( isset($_POST['createDB']) ) {
    if($GLOBALS['debug']) {
      echo "<br>DEBUG: createDB =" . $_POST['createDB'];
      createAll();
    } else {
      createAll();
      header('Location: ../admin/admin.php');
    }
  };

  if( isset($_POST['deleteDB']) ) {
    if($GLOBALS['debug']) {
      echo "<br>DEBUG: deleteDB =" . $_POST['deleteDB'];
      deleteDB();
    } else {
      deleteDB();
      header('Location: ../admin/admin.php');
    }
  };

?>
