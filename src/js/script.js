document.addEventListener('DOMContentLoaded', async () => {
    let test_data = null;
    let questionCount = 0;
    const formQuestions = document.getElementById('form-questions');
    const addQuestionButton = document.getElementById('add-question');
    const linkButton = document.getElementById('linkButton');

    let testDuration = {hours: "0", minutes: "0"}; // Значение по умолчанию

    document.getElementById('set-timer').addEventListener('click', () => {
        const hours = parseInt(document.getElementById('test-hours').value) || 0;
        const minutes = parseInt(document.getElementById('test-minutes').value) || 0;
        if (hours === 0 && minutes === 0) { // ДОБАВИТЬ ЧЕКБОКС "ОРГАНИЧИТЬ ВРЕМЯ ПРОХОЖДЕНИЯ ТЕСТА" И СДЕЛАТЬ ПРОВЕРКУ
            alert(`Установите время прохождения теста`);
            return;
        }
        testDuration = {hours, minutes};
        alert(`Время на тест установлено: ${hours} часов и ${minutes} минут`);
    });

    const createOptionsHTML = (type, questionId) => {
        if (type === 'text') {
            return `<div class="text-answer-container">
                      <textarea class="text-answer" placeholder="Введите развернутый ответ"></textarea>
                    </div>`;
        }
        if (type === 'matching') {
            return `   
                    <div class="matching-game-container">
                      <div class="matching-game">
                        <div class="column left-column">
                          <div class="card-pairs-container">
                            <div class="card-pair" data-pair-id="pair-1">
                              <div class="card left-card" data-id="left-1-0" data-original-id="left-1-0" contenteditable="true" placeholder="Термин"></div>
                              <div class="card right-card" data-id="right-1-0" data-original-id="right-1-0" contenteditable="true" placeholder="Определение"></div>
                              <button class="cross-but"><img class="cross" src="/src/static/img/cross.svg"></button>
                            </div>
                          </div>
                          <button class="add-pair-btn">Добавить пару</button>
                        </div>
                      </div>
                    </div>`;
        }
        const inputType = type === 'single' ? 'radio' : 'checkbox';
        return `<div class="option">
                  <input type="${inputType}" name="correct-answer-${questionId}" class="correct-answer" />
                  <span contenteditable="true">Вариант ответа 1</span><button class="cross-but"><img class="cross" src="/src/static/img/cross.svg" ></button>
                </div>
                <div class="option">
                  <input type="${inputType}" name="correct-answer-${questionId}" class="correct-answer" />
                  <span contenteditable="true">Вариант ответа 2</span><button class="cross-but"><img class="cross" src="/src/static/img/cross.svg" ></button>
                </div>
                <div class="option">
                  <input type="${inputType}" name="correct-answer-${questionId}" class="correct-answer" />
                  <span contenteditable="true">Вариант ответа 3</span><button class="cross-but"><img class="cross" src="/src/static/img/cross.svg" ></button>
                </div>
                <div class="option">
                  <input type="${inputType}" name="correct-answer-${questionId}" class="correct-answer" />
                  <span contenteditable="true">Вариант ответа 4</span><button class="cross-but"><img class="cross" src="/src/static/img/cross.svg" ></button>
                </div>
                <button class="add-option-btn">Добавить вариант ответа</button>`;
    };

    const addOption = (type, container, questionId) => {
        const inputType = type === 'single' ? 'radio' : 'checkbox';
        const newOption = document.createElement('div');
        newOption.className = 'option';
        newOption.innerHTML = `
            <input type="${inputType}" name="correct-answer-${questionId}" class="correct-answer" />
            <span contenteditable="true">Новый вариант ответа</span><button class="cross-but"><img class="cross" src="/src/static/img/cross.svg" ></button>`;
        container.insertBefore(newOption, container.querySelector('.add-option-btn'));
        newOption.querySelector('span').focus();
    };

    const attachAddOptionEvent = (type, container, questionId) => {
        const addOptionButton = container.querySelector('.add-option-btn');
        if (addOptionButton) {
            addOptionButton.addEventListener('click', () => addOption(type, container, questionId));
        }
    };

    document.addEventListener('click', function (event) {
        if (event.target.closest('.cross-but')) {
            const button = event.target.closest('.cross-but');
            const optionDiv = button.closest('.option');
            if (optionDiv) {
                optionDiv.remove();
            }
        }
    });

    const initializeQuestionControls = (question) => {
        const selectType = question.querySelector('.question-type');
        const optionsContainer = question.querySelector('.options');
        const scoreInput = question.querySelector('.score-input');
        const questionId = question.dataset.questionId || questionCount;

        selectType.addEventListener('change', () => {
            const type = selectType.value;
            optionsContainer.innerHTML = createOptionsHTML(type, questionId);
            attachAddOptionEvent(type, optionsContainer, questionId);
            if (selectType.value === 'matching') {
              initMatchingGame(question);
            }
        });

        question.querySelector('.delete-question').addEventListener('click', () => question.remove());

        question.querySelector('.copy-question').addEventListener('click', () => {
            questionCount++;
            const clonedQuestion = question.cloneNode(true);
            clonedQuestion.querySelector('.question-type').value = selectType.value;
            clonedQuestion.querySelectorAll('.option').forEach(option => {
                option.querySelector('input').name = `correct-answer-${questionCount}`;
            });
            initializeQuestionControls(clonedQuestion);
            formQuestions.insertBefore(clonedQuestion, question.nextSibling);
            clonedQuestion.scrollIntoView({ behavior: 'smooth' });
        });

        attachAddOptionEvent(selectType.value, optionsContainer, questionId);
    };

    async function getTestData() {
        const urlParams = new URLSearchParams(window.location.search);
        const testId = urlParams.get('test_id');
        if (!testId) return;

        try {
            const response = await fetch(`http://127.0.0.1:8000/api_v1/tests/${testId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCSRFToken()
                },
            });
            const data = await response.json();

            if (!data.title) throw new Error(data.detail || "Тест не найден");

            test_data = data;
            console.log("Данные теста загружены:", test_data);
        } catch (error) {
            console.error("Ошибка загрузки теста:", error);
            alert("Ошибка загрузки теста: " + error.message);
        }
    }

    let eventOnLinkAdded = false;

    // !!!
    // MAKSIM ТУТ ОТОБРАЖЕНИЕ СОХРАНЕННЫХ ТЕСТОВ!!!
    // !!!
    async function renderTests(testData) {
        const questionContainer = document.querySelector("#form-questions");
        questionContainer.innerHTML = "";
        const durationHours = testData.duration.slice(0, 2);
        const durationMinutes = testData.duration.slice(3, 5);
        document.getElementById('passing-score').value = testData.passing_score;
        document.getElementById('test-hours').value = durationHours;
        document.getElementById('test-minutes').value = durationMinutes;

        testData.questions.forEach(question => {
            const questionElement = document.createElement('div');
            questionElement.className = 'question';
            questionElement.dataset.questionId = question.id;

            const questionTitle = document.createElement('div');
            questionTitle.className = 'question-title';
            questionTitle.contentEditable = true;
            questionTitle.textContent = question.title;

            const selectType = document.createElement('select');
            selectType.className = 'question-type';

            ['single', 'multiple', 'text', 'matching'].forEach(type => {
                const option = document.createElement('option');
                option.value = type;
                option.textContent = type === 'single' ? 'Один вариант ответа' :
                    type === 'multiple' ? 'Несколько вариантов ответа' :
                    type === 'matching' ? 'Соотнесение карточек' : 'Развернутый ответ';
                if (type === question.question_type) option.selected = true;
                selectType.appendChild(option);
            });

            const optionsContainer = document.createElement('div');
            optionsContainer.className = 'options';

            if (question.question_type === 'matching') {
                const container = document.createElement('div');
                container.className = 'matching-game-container';
                container.innerHTML = `
                    <div class="matching-game">
                        <div class="column left-column">
                            <div class="card-pairs-container"></div>
                            <button class="add-pair-btn">Добавить пару</button>
                        </div>
                    </div>`;

                const pairsContainer = container.querySelector('.card-pairs-container');
                const connections = [];
                // Создаем карточки с уникальными ID
                question.options.forEach((pair, index) => {
                    const uniqueId = Date.now() + index;
                    const pairId = `pair-${uniqueId}`;
                    const leftId = `left-${uniqueId}-0`;
                    const rightId = `right-${uniqueId}-0`;

                    pairsContainer.insertAdjacentHTML('beforeend', `
                        <div class="card-pair" data-pair-id="${pairId}">
                            <div class="card left-card" data-id="${leftId}" 
                                 data-original-id="${leftId}" 
                                 contenteditable="true">${pair.text || 'Термин'}</div>
                            <div class="card right-card" data-id="${rightId}" 
                                 data-original-id="${rightId}" 
                                 contenteditable="true">${pair.is_correct || 'Определение'}</div>
                            <button class="cross-but"><img class="cross" src="/src/static/img/cross.svg"></button>
                        </div>`);
                    // Сохраняем информацию о связях
                    if (pair.is_correct && pair.text) {
                        connections.push({
                            leftText: pair.text,
                            rightText: pair.is_correct,
                            leftId: leftId,
                            rightId: rightId
                        });
                    }
                });

                optionsContainer.appendChild(container);

                // Двойная инициализация для гарантии
                setTimeout(() => {
                    initMatchingGame(questionElement);

                    const gameContainer = questionElement.querySelector('.matching-game');

                    connections.forEach(conn => {
                        const leftCard = questionElement.querySelector(`[data-id="${conn.leftId}"]`);
                        const rightCard = questionElement.querySelector(`[data-id="${conn.rightId}"]`);

                        if (leftCard && rightCard) {
                            // Обновляем ID для отображения связи
                            const leftParts = conn.leftId.split('-');
                            const rightParts = conn.rightId.split('-');

                            leftCard.dataset.id = `left-${leftParts[1]}-${rightParts[1]}`;
                            rightCard.dataset.id = `right-${rightParts[1]}-${leftParts[1]}`;

                            // Добавляем визуальные классы
                            leftCard.classList.add('matched');
                            rightCard.classList.add('matched');

                            // Создаем соединительную линию
                            const leftRect = leftCard.getBoundingClientRect();
                            const rightRect = rightCard.getBoundingClientRect();
                            const gameRect = gameContainer.getBoundingClientRect();

                            const leftX = leftRect.right - gameRect.left;
                            const leftY = leftRect.top + leftRect.height / 2 - gameRect.top;
                            const rightX = rightRect.left - gameRect.left;
                            const rightY = rightRect.top + rightRect.height / 2 - gameRect.top;

                            const length = Math.sqrt(Math.pow(rightX - leftX, 2) + Math.pow(rightY - leftY, 2));
                            const angle = Math.atan2(rightY - leftY, rightX - leftX) * 180 / Math.PI;

                            const connector = document.createElement('div');
                            connector.className = 'connector';
                            connector.style.width = `${length}px`;
                            connector.style.left = `${leftX}px`;
                            connector.style.top = `${leftY}px`;
                            connector.style.transform = `rotate(${angle}deg)`;

                            gameContainer.appendChild(connector);
                        }
                    });

                    // Принудительно активируем обработчики
                    questionElement.querySelectorAll('.card-pair').forEach(pair => {
                        const leftCard = pair.querySelector('.left-card');
                        const rightCard = pair.querySelector('.right-card');
                        const deleteBtn = pair.querySelector('.cross-but');

                        // Ручная привязка событий
                        leftCard?.addEventListener('click', handleCardClick);
                        rightCard?.addEventListener('click', handleCardClick);
                        deleteBtn?.addEventListener('click', function(e) {
                            e.stopPropagation();
                            pair.remove();
                        });
                    });

                    // Активируем кнопку добавления
                    const addButton = questionElement.querySelector('.add-pair-btn');
                    addButton?.addEventListener('click', function() {
                        const pairId = `pair-${Date.now()}`;
                        const leftId = `left-${Date.now()}-0`;
                        const rightId = `right-${Date.now()}-0`;



                        pairsContainer.insertAdjacentHTML('beforeend', pairHTML);
                    });
                }, 100);
            }

            else if (question.question_type === 'text') {
                const textAnswerContainer = document.createElement('div');
                textAnswerContainer.className = 'text-answer-container';
                const textArea = document.createElement('textarea');
                textArea.className = 'text-answer';
                textArea.placeholder = 'Введите развернутый ответ';
                textArea.value = question.options[0]?.text || '';
                textAnswerContainer.appendChild(textArea);
                optionsContainer.appendChild(textAnswerContainer);
            } else {
                question.options.forEach((option, index) => {
                    const optionElement = document.createElement('div');
                    optionElement.className = 'option';
                    const input = document.createElement('input');
                    input.type = question.question_type === 'single' ? 'radio' : 'checkbox';
                    input.name = `question-${question.id}`;
                    input.checked = option.is_correct;
                    const span = document.createElement('span');
                    span.contentEditable = true;
                    span.textContent = option.text;
                    const deleteOptionBtn = document.createElement('button');
                    deleteOptionBtn.className = 'cross-but';
                    deleteOptionBtn.innerHTML = '<img src="/src/static/img/cross.svg" alt="Удалить">';
                    optionElement.appendChild(input);
                    optionElement.appendChild(span);
                    optionElement.appendChild(deleteOptionBtn);
                    optionsContainer.appendChild(optionElement);
                });

                const addOptionButton = document.createElement('button');
                addOptionButton.className = 'add-option-btn';
                addOptionButton.textContent = 'Добавить вариант ответа';
                optionsContainer.appendChild(addOptionButton);
            }

            const questionControls = document.createElement('div');
            questionControls.className = 'question-controls';

            const copyButton = document.createElement('button');
            copyButton.className = 'copy-question';
            copyButton.innerHTML = '<img src="/src/static/img/copy.svg" alt="Копировать вопрос">';

            const deleteButton = document.createElement('button');
            deleteButton.className = 'delete-question';
            deleteButton.innerHTML = '<img src="/src/static/img/mycop.svg" alt="Удалить вопрос">';

            const score = document.createElement('input');
            score.className = 'score-input';
            score.type = 'number';
            score.placeholder = 'Вес вопроса'
            score.value = question.scores;

            questionControls.appendChild(score);
            questionControls.appendChild(copyButton);
            questionControls.appendChild(deleteButton);

            questionElement.appendChild(questionTitle);
            questionElement.appendChild(selectType);
            questionElement.appendChild(optionsContainer);
            questionElement.appendChild(questionControls);

            questionContainer.appendChild(questionElement);
            initializeQuestionControls(questionElement);
            linkButton.innerHTML = `<a href="#" id="linkText">http://127.0.0.1:63342/ConstructorFront/src/templates/UserData.html?test_id=${testData.id}</a>`;
            if (!eventOnLinkAdded) {
                copyLink();
                eventOnLinkAdded = true;
            }
        });
    }

    function copyLink () {
        const copyButton = document.querySelector('.menu-copy');
        const linkTextElement = document.getElementById('linkText');

        copyButton.addEventListener('click', (e) => {
            e.preventDefault();

            const textToCopy = linkTextElement.textContent;

            try {
                if (navigator.clipboard) {
                    navigator.clipboard.writeText(textToCopy).then(() => {
                        showNotification('Текст скопирован!');
                    }).catch(() => {
                        fallbackCopy();
                    });
                } else {
                    fallbackCopy();
                }
            } catch (err) {
                fallbackCopy();
            }

            function fallbackCopy() {
                const tempInput = document.createElement('input');
                tempInput.value = textToCopy;
                document.body.appendChild(tempInput);
                tempInput.select();
                try {
                    document.execCommand('copy');
                    showNotification('Текст скопирован!');
                } catch (err) {
                    showNotification('Не удалось скопировать');
                }
                document.body.removeChild(tempInput);
            }
        });
    }

    async function loadTest(testData) {
        try {
            if (testData) {
                document.querySelector("#test-title").textContent = testData.title;
                document.querySelector("#test-description").textContent = testData.description;
                await renderTests(testData);
            }
        } catch (error) {
            console.error("Ошибка загрузки теста:", error);
            alert("Не удалось загрузить тест");
        }
    }

    const addQuestion = () => {
        questionCount++;
        const questionHTML = `
            <div class="question">
                <div class="question-title" contenteditable="true">Новый вопрос</div>
                <select class="question-type">
                    <option value="single">Один вариант ответа</option>
                    <option value="multiple">Несколько вариантов ответа</option>
                    <option value="text">Развернутый ответ</option>
                    <option value="matching">Соотнесение карточек</option>
                </select>
                <div class="options">${createOptionsHTML('single', questionCount)}</div>
                <div class="question-controls">
                    <input type='number' class='score-input' placeholder="Вес вопроса" />
                    <button class="copy-question"><img src="/src/static/img/copy-2.svg"></button>
                    <button class="delete-question"><img src="/src/static/img/mycop-2.svg"></button>
                </div>
            </div>`;
        formQuestions.insertAdjacentHTML('beforeend', questionHTML);
        initializeQuestionControls(formQuestions.lastElementChild);
    };

    const saveTest = () => {
        const testTitle = document.querySelector('.form-header h1').textContent.trim();
        const testDescription = document.querySelector('.form-header-p').textContent.trim();
        const passingScore = document.getElementById('passing-score').value || 0;
        const hoursDuration = document.getElementById('test-hours').value;
        const minutesDuration = document.getElementById('test-minutes').value;
        let duration = hoursDuration.length === 1 ? "0" + hoursDuration + ":" : hoursDuration + ":";
        duration += minutesDuration.length === 1 ? "0" + minutesDuration + ":00" : minutesDuration + ":00";
        if (duration === "::00") {
            duration = '00:00:00';
        }
        const questions = Array.from(document.querySelectorAll('.question')).map(question => {
            const scoreInput = question.querySelector('.score-input');
            const scores = parseInt(scoreInput.value) || 0;
            // const scores = 10; // получить вес вопроса
            const title = question.querySelector('.question-title').textContent.trim();
            const questionType = question.querySelector('.question-type').value;
            let options = [];
            let answerText = '';

            if (questionType === 'text') {
                // Для текстового ответа сохраняем развернутый текст
                answerText = question.querySelector('.text-answer')?.value?.trim() || '';
                options = [{"text": answerText.toLowerCase(), "is_correct": true}]
            }
            else if (questionType === 'matching') {
                const leftCards = question.querySelectorAll('.left-card');

                leftCards.forEach(leftCard => {
                    const leftId = leftCard.dataset.id;
                    const [, pairNum, connectedRightNum] = leftId.split('-');

                    if (connectedRightNum !== '0') {
                        const rightCard = question.querySelector(`.right-card[data-id="right-${connectedRightNum}-${pairNum}"]`);

                        if (rightCard) {
                            options.push({
                                text: leftCard.textContent.trim(),
                                is_correct: rightCard.textContent.trim()
                            });
                        }
                    }
                });

                // Если нет ни одной связи, добавляем пустую опцию
                if (options.length === 0) {
                    options = [{"text": "", "is_correct": true}];
                }
            }
            else {
                // Для обычных вариантов ответа собираем данные
                options = Array.from(question.querySelectorAll('.option')).map(option => ({
                    text: option.querySelector('span').textContent.trim(),
                    is_correct: option.querySelector('input').checked
                }));
            }
            return {title, question_type: questionType, options, answer_text: answerText, scores};
        });

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

        const token = getCookie('token');
        const userId = getUserIdFromToken(token);

        let testData = {
            title: testTitle,
            description: testDescription,
            questions: questions,
            duration: duration,
            passing_score: passingScore,
            user_id: userId
        };

        let testId = null;

        if (test_data && test_data.id) {
            testData['id'] = test_data.id;
            testId = test_data.id;
        }

        console.log(testData);
        let url = 'http://127.0.0.1:8000/api_v1/tests';
        if (testId !== null) {
            url += `?test_id=${testId}`;
        }
        console.log(url)
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCSRFToken()
            },
            body: JSON.stringify(testData)
        })
            .then(response => {
                console.log(JSON.stringify(testData))
                if (response.ok) {
                    alert('Тест успешно сохранен!');
                    window.location.href = 'menu-konst.html';
                    return response.json();
                } else {
                    throw new Error('Ошибка при сохранении теста.');
                }
            })
            .catch(error => {
                alert('Ошибка сохранения теста.');
            });
    };

    const getCSRFToken = () => {
        const cookieValue = document.cookie
            .split('; ')
            .find(row => row.startsWith('csrftoken='))
            ?.split('=')[1];
        return cookieValue || '';
    };

    const addEventOnLinkButton = () => {
        const testId = test_data.id;
        window.location.href = `UserData.html?test_id=${testId}`;
    }

    async function init() {
        await getTestData();
        if (test_data) await loadTest(test_data);

        addQuestionButton.addEventListener('click', addQuestion);
        linkButton.addEventListener('click', addEventOnLinkButton);

        document.querySelector('.hc-button').addEventListener('click', saveTest);
    }

    init().catch(error => {
        console.error("Ошибка инициализации:", error);
        alert("Ошибка при загрузке страницы");
    });
});

function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.style.opacity = '1';

    setTimeout(() => {
        notification.style.opacity = '0';
    }, 2000);
}


function initMatchingGame(questionElement) {
    const gameContainer = questionElement.querySelector('.matching-game');
    const pairsContainer = questionElement.querySelector('.card-pairs-container');

        // Добавляем глобальную видимость обработчиков
    window.handleCardClick = handleCardClick;

    // Гарантируем, что все карточки получили обработчики
    questionElement.querySelectorAll('.card').forEach(card => {
        card.removeEventListener('click', handleCardClick);
        card.addEventListener('click', handleCardClick);
    });

    let selectedCard = null;
    const matches = {};
    const connectors = [];
    let pairCounter = 0; // Счётчик для пар

    // Обработчик клика по документу
    function handleDocumentClick(e) {
        if (!e.target.closest('.card') &&
            !e.target.closest('.cross-but') &&
            selectedCard) {
            selectedCard.classList.remove('selected');
            selectedCard = null;
        }
    }

    document.addEventListener('click', handleDocumentClick);
    questionElement.addEventListener('click', (e) => e.stopPropagation());

    // Генерация ID для карточек
    function generateCardIds(pairNum) {
        return {
            pairId: `pair-${pairNum}`,
            leftId: `left-${pairNum}-0`,
            rightId: `right-${pairNum}-0`
        };
    }

    // Обновление ID при соединении
    function updateConnectedIds(leftCard, rightCard) {
        const leftIdParts = leftCard.dataset.id.split('-');
        const rightIdParts = rightCard.dataset.id.split('-');

        // Обновляем последнюю часть ID
        leftIdParts[2] = rightIdParts[1]; // left-X-Y, где Y берём из right
        rightIdParts[2] = leftIdParts[1]; // right-X-Y, где Y берём из left

        const newLeftId = leftIdParts.join('-');
        const newRightId = rightIdParts.join('-');

        // Обновляем data-id и ID в matches
        matches[newLeftId] = newRightId;
        delete matches[leftCard.dataset.id];

        leftCard.dataset.id = newLeftId;
        rightCard.dataset.id = newRightId;

        // Обновляем connectors
        const connector = connectors.find(conn =>
            (conn.leftId === leftCard.dataset.originalId || conn.leftId === leftCard.dataset.id) &&
            (conn.rightId === rightCard.dataset.originalId || conn.rightId === rightCard.dataset.id)
        );
        if (connector) {
            connector.leftId = newLeftId;
            connector.rightId = newRightId;
        }
    }

    // Добавление новой пары
    questionElement.querySelector('.add-pair-btn')?.addEventListener('click', () => {
        pairCounter++;
        const ids = generateCardIds(pairCounter);

        const pairHTML = `
        <div class="card-pair" data-pair-id="${ids.pairId}">
            <div class="card left-card" data-id="${ids.leftId}" data-original-id="${ids.leftId}" contenteditable="true" placeholder="Термин"></div>
            <div class="card right-card" data-id="${ids.rightId}" data-original-id="${ids.rightId}" contenteditable="true" placeholder="Определение"></div>
            <button class="cross-but"><img class="cross" src="/src/static/img/cross.svg"></button>
        </div>`;

        pairsContainer.insertAdjacentHTML('beforeend', pairHTML);
        initCardEvents(pairsContainer.lastElementChild);
    });

    // Инициализация существующих карточек
    questionElement.querySelectorAll('.card-pair').forEach((pair, index) => {
        pairCounter = Math.max(pairCounter, index + 1);
        initCardEvents(pair);
    });

    // Обработчики для карточек
    function initCardEvents(pairElement) {
        const leftCard = pairElement.querySelector('.left-card');
        const rightCard = pairElement.querySelector('.right-card');
        const deleteBtn = pairElement.querySelector('.cross-but');

        [leftCard, rightCard].forEach(card => {
            card.addEventListener('click', handleCardClick);
        });

        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const pair = e.target.closest('.card-pair');
            const leftCard = pair.querySelector('.left-card');
            const rightCard = pair.querySelector('.right-card');

            if (leftCard.classList.contains('matched') || rightCard.classList.contains('matched')) {
                disconnectPair(leftCard.dataset.id, rightCard.dataset.id);
            }
            pair.remove();
        });
    }

    // Клик по карточке
    function handleCardClick(e) {
        e.stopPropagation();
        const card = e.currentTarget;

        // Отмена выделения
        if (card === selectedCard) {
            card.classList.remove('selected');
            selectedCard = null;
            return;
        }

        // Переназначение пары
        if (card.classList.contains('matched')) {
            const pair = findPairForCard(card.dataset.id);
            if (pair) disconnectPair(pair.leftId, pair.rightId);
        }

        // Сброс выделения
        gameContainer.querySelectorAll('.card').forEach(c => {
            c.classList.remove('selected');
        });

        // Новое выделение
        card.classList.add('selected');

        // Первая карточка
        if (!selectedCard) {
            selectedCard = card;
            return;
        }

        // Та же колонка
        if ((selectedCard.classList.contains('left-card') && card.classList.contains('left-card')) ||
            (selectedCard.classList.contains('right-card') && card.classList.contains('right-card'))) {
            selectedCard.classList.remove('selected');
            selectedCard = card;
            return;
        }

        // Соединение
        const [leftCard, rightCard] =
            selectedCard.classList.contains('left-card')
                ? [selectedCard, card]
                : [card, selectedCard];

        connectPair(leftCard, rightCard);
        selectedCard = null;
    }

    // Соединение пары
    function connectPair(leftCard, rightCard) {
        const leftId = leftCard.dataset.id;
        const rightId = rightCard.dataset.id;

        if (matches[leftId]) disconnectPair(leftId, matches[leftId]);
        if (Object.values(matches).includes(rightId)) {
            const leftIdToDisconnect = Object.keys(matches).find(key => matches[key] === rightId);
            disconnectPair(leftIdToDisconnect, rightId);
        }

        // Обновляем ID перед добавлением в matches
        updateConnectedIds(leftCard, rightCard);

        matches[leftCard.dataset.id] = rightCard.dataset.id;
        leftCard.classList.add('matched');
        rightCard.classList.add('matched');
        createConnector(leftCard, rightCard);
    }

    // Создание соединительной линии
    function createConnector(leftCard, rightCard) {
        const leftRect = leftCard.getBoundingClientRect();
        const rightRect = rightCard.getBoundingClientRect();
        const gameRect = gameContainer.getBoundingClientRect();

        const leftX = leftRect.right - gameRect.left;
        const leftY = leftRect.top + leftRect.height / 2 - gameRect.top;
        const rightX = rightRect.left - gameRect.left;
        const rightY = rightRect.top + rightRect.height / 2 - gameRect.top;

        const length = Math.sqrt(Math.pow(rightX - leftX, 2) + Math.pow(rightY - leftY, 2));
        const angle = Math.atan2(rightY - leftY, rightX - leftX) * 180 / Math.PI;

        const connector = document.createElement('div');
        connector.className = 'connector';
        connector.style.width = `${length}px`;
        connector.style.left = `${leftX}px`;
        connector.style.top = `${leftY}px`;
        connector.style.transform = `rotate(${angle}deg)`;

        gameContainer.appendChild(connector);
        connectors.push({
            leftId: leftCard.dataset.id,
            rightId: rightCard.dataset.id,
            element: connector
        });
    }

    // Разъединение пары
    function disconnectPair(leftId, rightId) {
        const leftCard = document.querySelector(`.card[data-id="${leftId}"]`);
        const rightCard = document.querySelector(`.card[data-id="${rightId}"]`);

        if (leftCard) {
            leftCard.classList.remove('matched');
            // Возвращаем оригинальный ID
            const originalId = leftCard.dataset.originalId;
            leftCard.dataset.id = originalId;
        }

        if (rightCard) {
            rightCard.classList.remove('matched');
            // Возвращаем оригинальный ID
            const originalId = rightCard.dataset.originalId;
            rightCard.dataset.id = originalId;
        }

        const connectorIndex = connectors.findIndex(
            conn => (conn.leftId === leftId && conn.rightId === rightId) ||
                   (conn.leftId === rightId && conn.rightId === leftId)
        );

        if (connectorIndex !== -1) {
            connectors[connectorIndex].element.remove();
            connectors.splice(connectorIndex, 1);
        }

        delete matches[leftId];
    }

    // Поиск пары
    function findPairForCard(cardId) {
        if (matches[cardId]) {
            return {leftId: cardId, rightId: matches[cardId]};
        }

        for (const [leftId, rightId] of Object.entries(matches)) {
            if (rightId === cardId) return {leftId, rightId};
        }

        return null;
    }

    // Очистка при удалении вопроса
    questionElement.querySelector('.delete-question')?.addEventListener('click', () => {
        document.removeEventListener('click', handleDocumentClick);
    });
}
