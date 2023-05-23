<?php
$post = file_get_contents('php://input');
$post = json_decode($post);
$result = array();

$mysqli = new mysqli("localhost", "root", "root", "test2");

$stmt = $mysqli->prepare('SELECT * FROM users WHERE id=?');
$stmt->bind_param("i", $post->user_id);
$stmt->execute();
$sql_result = $stmt->get_result();
$row = $sql_result->fetch_assoc();

if ($row) $result = array('name'=>$row['name'], 'date_birthday' =>$row['date_birthday'], 'photo' => $row['photo']);

$stmt->close();

echo json_encode(array('user' => $result, 'status' => 'ok'));