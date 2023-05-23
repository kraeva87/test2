async function get_data() {
    let session_id = getCookie("PHPSESSID"),
        user_id;
    if (session_id) user_id = getCookie(session_id + "_user_id");
    if (user_id) {
        let data = {'user_id': user_id};
        let error_mess = document.querySelector('.error');
        if (error_mess.classList.contains("active")) error_mess.classList.remove("active");

        const response = await fetch("http://test2/get_user.php", {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        let result = await response.json();
        if (result.status == 'ok') {
            let user = result.user;
            if (user.length != 0) {
                let answer = document.createElement('div');
                answer.classList.add("answer");
                const date_birthday = new Date(user['date_birthday']);
                answer.innerHTML += '<p><img src="/images/' + user['photo'] + '" alt="" class="photo"></p>\n' +
                    '<p>Имя: <span class="name">' + user['name'] + '</span></p>\n' +
                    '<p>Дата рождения: <span class="date_birthday">' + date_birthday.toDateString() + '</span></p>\n' +
                    '<p class="logout">Выход</p>';
                document.body.appendChild(answer);

                let form = document.getElementById('form');
                if (!form.classList.contains("inactive")) form.classList.add("inactive");

                let logout_button = document.querySelector('.answer .logout');
                logout_button.addEventListener('click', logout);
            } else {
                if (!error_mess.classList.contains("active")) error_mess.classList.add("active");
            }

        } else {
            console.log("Ошибка HTTP: " + response.status);
            if (!error_mess.classList.contains("active")) error_mess.classList.add("active");
        }
    }
}

async function login() {
    let session_id = getCookie("PHPSESSID"),
        counting;
    if (session_id) {
        setCookie(session_id + "_counting", parseInt(getCookie(session_id + "_counting"))+1, {expires: 900});
        counting = parseInt(getCookie(session_id + "_counting"));
    }
    let error_locked_mess = document.querySelector('.error_locked');
    let button = document.querySelector('.login_button');

    if (counting <= 5) {
        if (error_locked_mess.classList.contains("active")) error_locked_mess.classList.remove("active");
        if (button.classList.contains("locked")) button.classList.remove("locked");

        let login_field = document.getElementById('login'),
            password = document.getElementById('password');
        let data = {'login': login_field.value, 'password': password.value};
        let error_mess = document.querySelector('.error');

        if (error_mess.classList.contains("active")) error_mess.classList.remove("active");
        const response = await fetch("http://test2/auth.php", {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        let session_id = getCookie('PHPSESSID');
        let result = await response.json();
        if (result.status == 'ok') {
            let user = result.user;
            if (user.length != 0) {
                setCookie(session_id + "_user_id", user.user_id, {expires: 7200});
                get_data();

                let success_mess = document.querySelector('.success');
                if (!success_mess.classList.contains("active")) success_mess.classList.add("active");
                setTimeout(function () {
                    if (success_mess.classList.contains("active")) success_mess.classList.remove("active");
                }, 10000);
            } else {
                if (!error_mess.classList.contains("active")) error_mess.classList.add("active");

            }

        } else {
            console.log("Ошибка HTTP: " + response.status);
            if (!error_mess.classList.contains("active")) error_mess.classList.add("active");
        }
    } else {
        if (!button.classList.contains("locked")) button.classList.add("locked");
        if (!error_locked_mess.classList.contains("active")) error_locked_mess.classList.add("active");
    }
}

function logout() {
    let session_id = getCookie('PHPSESSID');
    deleteCookie(session_id + "_user_id");

    let answer = document.querySelector('.answer');
    if (answer) answer.remove();

    let form = document.getElementById('form');
    if (form.classList.contains("inactive")) form.classList.remove("inactive");
}

function setCookie(name, value, options) {
    options = options || {};

    var expires = options.expires;

    if (typeof expires == "number" && expires) {
        var d = new Date();
        d.setTime(d.getTime() + expires * 1000);
        expires = options.expires = d;
    }
    if (expires && expires.toUTCString) {
        options.expires = expires.toUTCString();
    }
    options.path='/';
    options.domain = window.location.hostname;

    value = encodeURIComponent(value);

    var updatedCookie = name + "=" + value;

    for (var propName in options) {
        updatedCookie += "; " + propName;
        var propValue = options[propName];
        updatedCookie += "=" + propValue;
    }

    document.cookie = updatedCookie;
}

function deleteCookie(name) {
    setCookie(name, "", {
        expires: -1
    })
}

function getCookie(name) {
    var matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

window.onload = function() {
    get_data();
    let login_button = document.querySelector('#form .login_button');
    login_button.addEventListener('click', login);
};