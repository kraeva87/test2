<?php
$post = file_get_contents('php://input');
$post = json_decode($post);
$result = array();
$password = md5($post->password);

$mysqli = new mysqli("localhost", "root", "root", "test2");

$stmt = $mysqli->prepare('SELECT * FROM users WHERE login=? AND password=?');
$stmt->bind_param("ss", $post->login, $password);
$stmt->execute();
$sql_result = $stmt->get_result();
$row = $sql_result->fetch_assoc();

if ($row) $result = array('user_id'=>$row['id']);

$stmt->close();

echo json_encode(array('user' => $result, 'status' => 'ok'));