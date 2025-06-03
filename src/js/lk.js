function getCookie(name) {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        const [cookieName, cookieValue] = cookie.trim().split('=');
        if (cookieName === name) {
            return cookieValue;
        }
    }
    return null;
}

async function fetchUserData() {
    try {
        const response = await fetch("http://127.0.0.1:8000/api_v1/users/me", {
            method: "GET",
            credentials: "include",
            headers: {
              "Accept": "application/json"
            }
        });
        if (!response.ok) {
            throw new Error("Ошибка при получении данных пользователя");
        }
        const userData = response.json();
        return userData;
    } catch (error) {
        console.error("Ошибка:", error);
    }
}


document.addEventListener('DOMContentLoaded', () => {
    const deleteBtn = document.getElementById('deleteAccount');
    const userData = fetchUserData();
    let userId;
    let firstName;
    let lastName;
    let email;
    userData.then(res => {
        userId = res.id;
        firstName = res.first_name;
        lastName = res.last_name;
        email = res.email;
        if (document.querySelector('.name')) {
            const nameHTML = document.querySelector('.name');
            nameHTML.textContent = lastName + ' ' + firstName;
            const emailHTML = document.querySelector('.email')
            emailHTML.textContent = email;

        } else {
            const nameHTML = document.querySelector('.avatar-p-1');
            nameHTML.textContent = lastName + ' ' + firstName;
            const emailHTML = document.querySelector('.avatar-p-2')
            emailHTML.textContent = email;
        }
    })

    if (deleteBtn) {
        deleteBtn.addEventListener('click', async () => {
            if (!confirm('Вы уверены, что хотите удалить аккаунт? Это действие необратимо.')) return;

            try {
                const response = await fetch(`http://127.0.0.1:8000/api_v1/users/${userId}`, {
                    method: 'DELETE',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' }
                });

                if (response.ok) {
                    alert('Аккаунт успешно удалён.');
                    window.location.href = 'login.html';
                } else {
                    const errorData = await response.json();
                    alert('Ошибка при удалении аккаунта: ' + (errorData.message || response.statusText));
                }
            } catch (error) {
                alert('Ошибка сети: ' + error.message);
            }
        });
    }

    const logoutBtn = document.getElementById('logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            try {
                const response = await fetch("http://127.0.0.1:8000/api_v1/auth/logout", {
                    method: 'POST',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' }
                });

                if (response.ok) {
                    alert('Вы вышли из аккаунта.');
                    window.location.href = 'login.html';
                } else {
                    alert('Ошибка при выходе из аккаунта.');
                }
            } catch (error) {
                alert('Ошибка сети: ' + error.message);
            }
        });
    }

    const form = document.getElementById('registrationForm-lk');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const firstName = document.getElementById('firstName').value.trim();
            const lastName = document.getElementById('lastName').value.trim();

            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (password !== confirmPassword) {
                alert('Пароли не совпадают!');
                return;
            }

            try {
                const response = await fetch(`http://127.0.0.1:8000/api_v1/users/${userId}`, {
                    method: 'PATCH',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: email,
                        first_name: firstName,
                        last_name: lastName,
                        password: password })
                });

                if (response.ok) {
                    alert('Данные успешно сохранены!');
                    window.location.href = 'lk-PersonalData.html';
                } else {
                    const errorData = await response.json();
                    alert('Ошибка при сохранении данных: ' + (errorData.message || response.statusText));
                }
            } catch (error) {
                alert('Ошибка сети: ' + error.message);
            }
        });
    }
});
