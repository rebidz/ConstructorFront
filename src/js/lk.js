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

// function getJwtTokenFromCookies() {
//   const cookies = document.cookie.split('; ');
//   console.log(cookies)
//   for (const cookie of cookies) {
//     // Правильное разделение имени и значения
//     const separatorIndex = cookie.indexOf('=');
//     if (separatorIndex === -1) continue;
//
//     const name = cookie.substring(0, separatorIndex).trim();
//     const value = cookie.substring(separatorIndex + 1).trim();
//     console.log(value);
//     if (name === 'token') {
//       return decodeURIComponent(value); // Декодируем URI-компоненты
//     }
//   }
//   return null;
// }
// function decodeJwtToken(token) {
//   try {
//     // JWT состоит из 3 частей, разделенных точками: header.payload.signature
//     const base64Url = token.split('.')[1];
//
//     // Заменяем символы, специфичные для base64url
//     const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
//
//     // Декодируем base64
//     const jsonPayload = decodeURIComponent(
//       atob(base64)
//         .split('')
//         .map(c => '%' + ('00' + c.charCodeAt(0).toString(16).slice(-2))
//         .join('')
//     ));
//
//     return JSON.parse(jsonPayload);
//   } catch (error) {
//     console.error('Ошибка декодирования JWT:', error);
//     return null;
//   }
// }
//
// function getUserIdFromJwt() {
//   // 1. Получаем токен из куки
//   const token = getJwtTokenFromCookies();
//   if (!token) {
//     console.error('JWT токен не найден в куках');
//     return null;
//   }
//
//   // 2. Декодируем токен
//   const decodedToken = decodeJwtToken(token);
//   if (!decodedToken) {
//     console.error('Не удалось декодировать JWT токен');
//     return null;
//   }
//
//   // 3. Извлекаем user_id
//   const userId = decodedToken.id; // В вашем примере это поле "id"
//   if (!userId) {
//     console.error('Поле id не найдено в JWT токене');
//     return null;
//   }
//
//   return userId;
// }


document.addEventListener('DOMContentLoaded', () => {
    const deleteBtn = document.getElementById('deleteAccount');
    const userId = 'defd7a5a-4f70-4970-9db5-19d7580d8e8b';
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
                    window.location.href = '/login.html';
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

            const fullName = document.getElementById('firstName').value.trim();
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

