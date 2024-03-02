<?php
//freemysqlhosting
$host = "sql10.freemysqlhosting.net";
$user = "sql10688200";
$password = "ePfYtKWlz2";
$dbname = "sql10688200";
$port = "3306";

/*
//MySQL
$host = "sql305.infinityfree.com";
$user = "if0_35033672";
$password = "jC4vL41iznqJqc";
$dbname = "if0_35033672_chat_history";
$port = "3306";*/

try{
  //Set DSN data source name
  $dsn = "mysql:host=" . $host . ";port=" . $port .";dbname=" . $dbname . ";user=" . $user . ";password=" . $password . ";";

  //create a pdo instance
  $pdo = new PDO($dsn, $user, $password);
  $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE,PDO::FETCH_OBJ);
  $pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES,false);
  $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
}
catch (PDOException $e) {
die('Connection failed: ' . $e->getMessage());
}

$action = isset($_POST["action"]) ? 
$_POST["action"] : "list";

if ($action == "include") {
    $text = $_POST["text"];

    $sql = "INSERT INTO `message` (
        `text`
     ) VALUES (
        '[text]'
     );";
     //echo $sql;

     $sql = str_replace("[text]", $text, $sql);

     $stmt = $pdo->prepare($sql);
     $stmt->execute();
     echo $sql;
} 
else {
    $sql = "SELECT id, text, timestamp FROM `message`;";

    try{
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $rowCount = $stmt->rowCount();
    $result = $stmt->fetchAll(); 
    }
    catch (PDOException $e) {
        die($e->getMessage());
    }

    echo json_encode($result);
}
?>
