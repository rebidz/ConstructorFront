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
        const userData = await response.json();
        await displayUserTests(userData.tests); // Отображаем тесты пользователя
    } catch (error) {
        console.error("Ошибка:", error);
    }
}

function setupCardHandlers() {
    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {
        // Обработчик клика на карточку (переход к редактированию)
        card.addEventListener('click', (event) => {
            if (!event.target.closest('.card-delete')) { // Исключаем клик на кнопке удаления
                const testId = card.dataset.testId;
                window.location.href = `konst.html?test_id=${testId}`; // Переход на страницу редактирования
            }
        });

        // Обработчик клика на кнопку удаления
        const deleteButton = card.querySelector('.card-delete');
        deleteButton.addEventListener('click', async (event) => {
            event.stopPropagation(); // Останавливаем всплытие события
            if (confirm('Вы уверены, что хотите удалить этот тест?')) {
                await deleteTest(card.dataset.testId, card);
            }
        });
    });
}

// Функция для отображения тестов пользователя
async function displayUserTests(tests) {
    const vacanciesSection = document.querySelector('.vacancies');
    vacanciesSection.innerHTML = ''; // Очищаем секцию перед добавлением новых тестов
    tests.forEach(test => {
        let cardTitle = test.title
        if (cardTitle.length > 12) {
            cardTitle = cardTitle.slice(0, 12) + '...'
        }
        const testCard = `
            <div class="card" data-test-id="${test.id}">
                <div class="card-image"></div>
                <div class="card-content">
                    <div class="card-title">${cardTitle}</div>
                    <div class="card-date">Создано: ${new Date(test.created_at).toLocaleDateString()}</div>
                    <button class="card-delete"><img src="/src/static/img/recycle.svg"></button>
                </div>
            </div>
        `;
        vacanciesSection.insertAdjacentHTML('beforeend', testCard);
    });
    setupCardHandlers();

    const searchBar = document.querySelector('.search-bar-1');
        searchBar.addEventListener('click', () => {
            window.location.href = 'konst.html';
        });
}

// Функция для удаления теста
async function deleteTest(testId, cardElement) {
    try {
        const response = await fetch(`http://127.0.0.1:8000/api_v1/tests/${testId}`, {
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