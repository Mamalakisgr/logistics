<?php
$username = $_POST['username'];
$password = $_POST['password'];
$email = $_POST['email'];


//Database Connection
$conn = new mysqli('localhost','root','','testuru');
if($conn->connect_error){
    die('Connection failed : '.$conn->connect_error);
}
else{
    $stmt = $conn->prepare("insert into registration(username,password,email) values(?,?,?)");
    $stmt->bind_param("sis",$username,$password,$email);
    $stmt->execute();
    echo "registration Success";
    $stmt->Close();
    $conn->close();
}

?>