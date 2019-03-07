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

  function changeRole($id) {

    global $conn;

    $sql = "SELECT FROM db.users WHERE id = '$id'";

    if($conn->query($sql)){
      header('Location: ../admin/admin.php');
    } else {
      echo "Something went wrong";
      echo "<br><a href='../admin/admin.php'><button>Go back</button></a>";
    }
  };
?>
