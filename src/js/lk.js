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

function getUserIdFromToken(token) {
    if (!token) return null;

    try {
        const payloadBase64 = token.split('.')[1];
        const payloadJson = atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'));
        const payload = JSON.parse(payloadJson);
        return payload.id || payload.sub || null;
    } catch (error) {
        console.error("Ошибка при декодировании токена:", error);
        return null;
    }
}


document.addEventListener('DOMContentLoaded', () => {
    const deleteBtn = document.getElementById('deleteAccount');
    const token = getCookie('token');
    const userId = getUserIdFromToken(token);
    if (deleteBtn) {
        deleteBtn.addEventListener('click', async () => {
            if (!confirm('Вы уверены, что хотите удалить аккаунт? Это действие необратимо.')) return;

            try {
                const response = await fetch(`http://127.0.0.1:8000/users/delete_user/${userId}`, {
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
                const response = await fetch("http://127.0.0.1:8000/auth/logout", {
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
            // ДОДЕЛАТЬ ПОЛУЧЕНИЕ ДАННЫХ ПОЛЬЗОВАТЕЛЯ
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
                const response = await fetch(`http://127.0.0.1:8000/users/update_user/${userId}`, {
                    method: 'PUT',
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
