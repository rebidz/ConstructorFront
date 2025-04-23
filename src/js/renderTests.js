// document.addEventListener('DOMContentLoaded', function () {
//     // Функция для загрузки тестов с сервера
//     function loadTests() {
//         fetch('../get_tests') // Эндпоинт для получения списка тестов
//             .then(response => response.json())
//             .then(data => {
//                 if (data.success) {
//                     const vacanciesSection = document.querySelector('.vacancies');
//                     vacanciesSection.innerHTML = ''; // Очищаем секцию
//                     data.tests.forEach(test => {
//                         let cardTitle = test.title
//                         if (cardTitle.length > 12) {
//                             cardTitle = cardTitle.slice(0, 12) + '...'
//                         }
//                         const cardHTML = `
//                             <div class="card" data-test-id="${test.id}">
//                                 <div class="card-image"></div>
//                                 <div class="card-content">
//                                     <div class="card-title">${cardTitle}</div>
//                                     <div class="card-date">${test.updated_at}</div>
//                                     <button class="card-delete"><img src="/static/img/recycle.svg"></button>
//                                 </div>
//                             </div>
//                         `;
//                         vacanciesSection.insertAdjacentHTML('beforeend', cardHTML);
//                     });
//
//                     // Добавляем обработчики удаления
//                     setupCardHandlers();
//                 } else {
//                     console.error('Ошибка загрузки тестов');
//                 }
//             })
//             .catch(error => {
//                 console.error('Ошибка запроса:', error);
//             });
//     }
//
//     // Загружаем тесты при загрузке страницы
//     loadTests();
//
//     // Функция для удаления теста
//     function deleteTest(testId, cardElement) {
//         fetch(`../delete_test/${testId}/`, { method: 'DELETE' })
//             .then(response => {
//                 if (response.ok) {
//                     // Удаляем карточку из DOM
//                     cardElement.remove();
//                 } else {
//                     console.error('Ошибка при удалении теста');
//                 }
//             })
//             .catch(error => {
//                 console.error('Ошибка запроса:', error);
//             });
//     }
//
//     // Устанавливаем обработчики для карточек тестов
//     function setupCardHandlers() {
//         const cards = document.querySelectorAll('.card');
//         cards.forEach(card => {
//             // Обработчик клика на карточку (переход к редактированию)
//             card.addEventListener('click', (event) => {
//                 if (!event.target.closest('.card-delete')) { // Исключаем клик на кнопке удаления
//                     const testId = card.dataset.testId;
//                     window.location.href = `../edit_test/${testId}/`; // Переход на страницу редактирования
//                 }
//             });
//
//             // Обработчик клика на кнопку удаления
//             const deleteButton = card.querySelector('.card-delete');
//             deleteButton.addEventListener('click', (event) => {
//                 event.stopPropagation(); // Останавливаем всплытие события
//                 if (confirm('Вы уверены, что хотите удалить этот тест?')) {
//                     deleteTest(card.dataset.testId, card);
//                 }
//             });
//         });
//     }
//
//     // Устанавливаем обработчики для карточек шаблонов
//     // function setupTemplateHandlers() {
//     //     const templates = document.querySelectorAll('.search-bar')
//     //     templates.forEach(template => {
//     //         // Обработчик клика на карточку (переход к редактированию)
//     //         template.addEventListener('click', (event) => {
//     //             if (!event.target.closest('.card-delete')) { // Исключаем клик на кнопке удаления
//     //                 const testId = template.dataset.testId;
//     //                 window.location.href = `../edit_test/${testId}/`; // Переход на страницу редактирования
//     //             }
//     //         });
//     //     });
//     // }
//     //
//     // setupTemplateHandlers();
// });


// Функция для получения данных о пользователе
async function fetchUserData() {
    try {
        const response = await fetch("http://127.0.0.1:8000/users/me", {
            method: "GET",
            credentials: "include",
            headers: {
              "Accept": "application/json"
            }
        });
        if (!response.ok) {
            throw new Error("Ошибка при получении данных пользователя");
        }
        const userData = await response.json();
        displayUserTests(userData.tests); // Отображаем тесты пользователя
    } catch (error) {
        console.error("Ошибка:", error);
    }
}

// Функция для отображения тестов пользователя
async function displayUserTests(tests) {
    const vacanciesSection = document.querySelector('.vacancies');
    vacanciesSection.innerHTML = ''; // Очищаем секцию перед добавлением новых тестов
    tests.forEach(test => {
        const testCard = document.createElement('div');
        testCard.classList.add('card');

        // Заполняем карточку данными теста
        testCard.innerHTML = `
            <div class="card-image"></div>
            <div class="card-content">
                <div class="card-title">${test.title}</div>
                <div class="card-date">Создано: ${new Date(test.created_at).toLocaleDateString()}</div>
                <button class="card-delete" data-id="${test.id}"><img src="/src/static/img/recycle.svg"></button>
            </div>
        `;

        // Добавляем обработчик клика на кнопку удаления
        const deleteButton = testCard.querySelector('.card-delete');
        deleteButton.addEventListener('click', (event) => {
            event.stopPropagation(); // Останавливаем всплытие события
            if (confirm('Вы уверены, что хотите удалить этот тест?')) {
                deleteTest(test.id, testCard);
            }
        });

        const searchBar = document.querySelector('.search-bar-1');
        searchBar.addEventListener('click', () => {
            window.location.href = 'konst.html';
        });

        // Добавляем карточку в секцию с вакансиями
        vacanciesSection.appendChild(testCard);
    });
}

// Функция для удаления теста
async function deleteTest(testId, cardElement) {
    try {
        const response = await fetch(`http://127.0.0.1:8000/tests/delete_test/${testId}`, {
            method: "DELETE",
            headers: {
              "Accept": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error("Ошибка при удалении теста");
        }
        console.log(response.message)
        // Удаляем карточку из DOM
        cardElement.remove();
    } catch (error) {
        console.error("Ошибка:", error);
    }
}

// Вызов функции для получения данных при загрузке страницы
document.addEventListener('DOMContentLoaded', fetchUserData);