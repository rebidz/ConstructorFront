if (document.getElementById('loginForm') !== null) {
    document.getElementById('loginForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        fetch("http://127.0.0.1:8000/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                email: email,
                password: password
            }),
            credentials: "include",
        })
        .then(response => response.json())
        .then(response => {
            console.log("Ответ от сервера:", response.message);
            if (response.ok) {
                window.location.href = 'menu-konst.html';
            } else {
                alert(response.detail);
            }
        })
        .catch(error => {
            console.error("Ошибка:", error);
        });
    });
} else {
    document.getElementById('registrationForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const password = document.getElementById('password').value;

        fetch("http://127.0.0.1:8000/users/create_user", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
                first_name: firstName,
                last_name: lastName,
                password: password
            }),
        })
        .then(response => response.json())
        .then(response => {
            console.log("Ответ от сервера:", response);
            if (response.ok) {
                window.location.href = 'login.html';
            } else {
                alert(response.detail);
            }
        })
        .catch(error => {
            console.error("Ошибка:", error);
        });
    });
}
// document.getElementById('loginForm').addEventListener('submit', function(event) {
//     event.preventDefault();
//
//     const email = document.getElementById('email').value;
//     const password = document.getElementById('password').value;
//
//     fetch("http://127.0.0.1:8000/auth/login", {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/x-www-form-urlencoded",
//         },
//         body: new URLSearchParams({
//             email: email,
//             password: password
//         }),
//         credentials: "include",
//     })
//     .then(response => response.json())
//     .then(response => {
//         console.log("Ответ от сервера:", response.message);
//         if (response.ok) {
//             // Задержка для "надежной" записи cookie
//             setTimeout(() => {
//                 window.location.href = 'menu-konst.html';
//             }, 100);  // 100мс обычно достаточно
//         } else {
//             alert(response.detail);
//         }
//     })
//     .catch(error => {
//         console.error("Ошибка:", error);
//     });
// });
//
// document.getElementById('registrationForm').addEventListener('submit', function(event) {
//     event.preventDefault();
//
//     const email = document.getElementById('email').value;
//     const firstName = document.getElementById('firstName').value;
//     const lastName = document.getElementById('lastName').value;
//     const password = document.getElementById('password').value;
//
//     fetch("http://127.0.0.1:8000/users/create_user", {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//             email: email,
//             first_name: firstName,
//             last_name: lastName,
//             password: password
//         }),
//     })
//     .then(response => response.json())
//     .then(response => {
//         console.log("Ответ от сервера:", response);
//         if (response.ok) {
//             window.location.href = 'login.html';
//         } else {
//             alert(response.detail);
//         }
//     })
//     .catch(error => {
//         console.error("Ошибка:", error);
//     });
// });