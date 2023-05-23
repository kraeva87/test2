<?php
session_id(md5(uniqid()));
session_start();
setcookie(session_id() . "_counting", 0, time()+900);
?>
<html>
<head>
    <link href="/style.css" rel="stylesheet">
</head>
<body>
    <div id="form">
        <h1>Авторизация</h1>
        <p class="error_locked">Попробуйте позже.</p>
        <p><label for="login">Логин:</label> <input type="text" id="login"></p>
        <p><label for="password">Пароль:</label> <input type="text" id="password"></p>
        <p class="login_button">Вход</p>
    </div>

    <p class="error">Ошибка! Логин или пароль не правильные.</p>
    <p class="success">Вы успешно авторизованы.</p>

    <script src="/script.js"></script>
</body>
</html>