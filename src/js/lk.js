// document.addEventListener('DOMContentLoaded', () => {
//     const deleteBtn = document.getElementById('deleteAccount');
//     const logoutBtn = document.getElementById('logout');
//
//     deleteBtn.addEventListener('click', async () => {
//         if (!confirm('Вы уверены, что хотите удалить аккаунт? Это действие необратимо.')) return;
//
//         try {
//             const response = await fetch('**********', {
//                 method: 'DELETE',
//                 credentials: 'include',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 }
//             });
//
//             if (response.ok) {
//                 alert('Аккаунт успешно удалён.');
//                 window.location.href = 'login.html';
//             } else {
//                 const errorData = await response.json();
//                 alert('Ошибка при удалении аккаунта: ' + (errorData.message || response.statusText));
//             }
//         } catch (error) {
//             alert('Ошибка сети: ' + error.message);
//         }
//     });
//
//     logoutBtn.addEventListener('click', async () => {
//         try {
//             const response = await fetch('*********', {
//                 method: 'POST',
//                 credentials: 'include',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 }
//             });
//
//             if (response.ok) {
//                 alert('Вы вышли из аккаунта.');
//                 window.location.href = '/login.html';
//             } else {
//                 alert('Ошибка при выходе из аккаунта.');
//             }
//         } catch (error) {
//             alert('Ошибка сети: ' + error.message);
//         }
//     });
// });

document.addEventListener('DOMContentLoaded', () => {
    const deleteBtn = document.getElementById('deleteAccount');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', async () => {
            if (!confirm('Вы уверены, что хотите удалить аккаунт? Это действие необратимо.')) return;

            try {
                const response = await fetch('*******', {
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
                const response = await fetch('******', {
                    method: 'POST',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' }
                });

                if (response.ok) {
                    alert('Вы вышли из аккаунта.');
                    window.location.href = '/login.html';
                } else {
                    alert('Ошибка при выходе из аккаунта.');
                }
            } catch (error) {
                alert('Ошибка сети: ' + error.message);
            }
        });
    }

    const form = document.getElementById('registrationForm');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const fullName = document.getElementById('firstName').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (password !== confirmPassword) {
                alert('Пароли не совпадают!');
                return;
            }

            try {
                const response = await fetch('******', {
                    method: 'PUT',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ fullName, email, password })
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