<?php
require_once "apihelpers.php";

//die(); return;

$raw = file_get_contents("php://input");
$o = json_decode($raw);
$data = $o->data;
$cmd = $o->cmd;
$result = (object)[];
if ($cmd == 'login'){ 
  $usernameemail = $data->name;
  $password = $data->pwd;
  $conn = db_connect(); 
  $res = mysqli_query($conn, "SELECT * FROM tb_user WHERE username = '$usernameemail' OR email = '$usernameemail'");
  $row = mysqli_fetch_assoc($res);
  if(mysqli_num_rows($res) > 0){
    if($password == $row['password']){
      //exit('login, isset submit, multiple, correct pwd');
      $_SESSION["login"] = true;
      $_SESSION["id"] = $row["id"];
      //header("Location: index.php");
      $result->id = $row['id'];
      $result->status = "loggedin";
      $result->user = $row;
    }else{
      //echo "<script> alert('Wrong Password'); </script>";
      $result->id = $row['id'];
      $result->status = "wrong_pwd";
      //exit('login, isset submit, multiple, WRONG pwd');
    }
  }else{
    //echo "<script> alert('User Not Registered'); </script>";
    $result->id = $usernameemail;
    $result->status = "not_registered";
    //exit('login, isset submit, not registered');
  }
}else if ($cmd == 'logout'){ 
  $_SESSION = [];
  session_unset();
  session_destroy();
  
}else if ($cmd == 'register'){ 
  $name = $data->name; //$_POST["name"];
  $username = $data->username; // $_POST["username"];
  $email = $data->email; //$_POST["email"];
  $password = $data->password; //$_POST["password"];
  $confirmpassword = $data->confirmpassword; //$_POST["confirmpassword"];
  $conn = db_connect(); 
  $duplicate = mysqli_query($conn, "SELECT * FROM tb_user WHERE username = '$username' OR email = '$email'");
  if(mysqli_num_rows($duplicate) > 0){
    //echo "<script> alert('Username or Email Has Already Taken'); </script>";
    $result->status = "duplicate";
  }else if($password == $confirmpassword){
    $query = "INSERT INTO tb_user VALUES('','$name','$username','$email','$password')";
    mysqli_query($conn, $query);
    //echo "<script> alert('Registration Successful'); </script>";
    $result->status = "registered";
  }else{
    //echo "<script> alert('Password Does Not Match'); </script>";
    $result->status = "pwds_dont_match";
  }
}else if ($cmd == 'addEvent'){ 
  $date = $data->date; 
  $title = $data->title; 
  $text = $data->text; 
  $conn = db_connect(); 
  $query = "INSERT INTO tb_event VALUES('','$title','$text',null,'$date')";
  $res = mysqli_query($conn, $query);
  $id = mysqli_insert_id($conn);
  $res = mysqli_query($conn, "SELECT * FROM tb_event WHERE id = '$id'");
  $row = mysqli_fetch_assoc($res);
  $result->event = $row;
}else if ($cmd == "assets") {
	$path = '../../base/assets/';
	$c52 = file_get_contents($path . 'c52.yaml');
	$syms = file_get_contents($path . 'allSyms.yaml');
	$symGSG = file_get_contents($path . 'symGSG.yaml');
	$cinno = file_get_contents($path . 'fe/inno.yaml');
	$info = file_get_contents($path . 'lists/info.yaml');
	$sayings = file_get_contents($path . 'games/wise/sayings.yaml');
	$config = file_get_contents(__DIR__ . '/../config.yaml');
  $users = get_table('tb_user');
  //pp($users); echo 'hallo'; exit();
	$result = (object) [
    'sayings' => $sayings, 
    'info' => $info, 
    'users' => get_table('tb_user'), 
    'events' => get_table('tb_event'), 
    'subscribed' => get_table('tb_subscribed'), 
    'config' => $config, 
    'c52' => $c52, 
    'cinno' => $cinno, 
    'syms' => $syms, 
    'symGSG' => $symGSG];
	//$result = (object) ['sayings' => $sayings, 'info' => $info, 'c52' => $c52, 'cinno' => $cinno, 'syms' => $syms, 'symGSG' => $symGSG];
}
echo json_encode($result); 


