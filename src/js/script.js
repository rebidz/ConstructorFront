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
            return `<div class="matching-container">
                      <div class="card-pair">
                        <input type="text" placeholder="1" />
                        <input type="text" placeholder="1" />
                      </div>
                      <div class="card-pair">
                        <input type="text" placeholder="2" />
                        <input type="text" placeholder="2" />
                      </div>
                      <button class="add-card-pair-btn">Добавить пару карточек</button>
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
            if (type === 'matching') {
                // Логика для добавления пар карточек
                attachAddCardPairEvent(optionsContainer);
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
        });

        attachAddOptionEvent(selectType.value, optionsContainer, questionId);
    };

    // Функция для добавления пар карточек
    const attachAddCardPairEvent = (container) => {
        const addCardPairButton = container.querySelector('.add-card-pair-btn');
        if (addCardPairButton) {
            addCardPairButton.addEventListener('click', () => {
                const cardPairDiv = document.createElement('div');
                cardPairDiv.className = 'card-pair';
                cardPairDiv.innerHTML = `
                  <input type='text' placeholder='Карточка' />
                  <input type='text' placeholder='Соответствующая карточка' />`;
                container.insertBefore(cardPairDiv, addCardPairButton);
            });
        }
    };

    async function getTestData() {
        const urlParams = new URLSearchParams(window.location.search);
        const testId = urlParams.get('test_id');
        if (!testId) return;

        try {
            const response = await fetch(`http://127.0.0.1:8000/tests/get_test/${testId}`);
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

            ['single', 'multiple', 'text'].forEach(type => {
                const option = document.createElement('option');
                option.value = type;
                option.textContent = type === 'single' ? 'Один вариант ответа' :
                    type === 'multiple' ? 'Несколько вариантов ответа' : 'Развернутый ответ';
                if (type === question.question_type) option.selected = true;
                selectType.appendChild(option);
            });

            const optionsContainer = document.createElement('div');
            optionsContainer.className = 'options';

            if (question.question_type === 'text') {
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
            linkButton.innerHTML = `<a href="#" id="linkText">http://127.0.0.1:54722/ConstructorFront/src/templates/UserData.html?test_id=${testData.id}</a>`;
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
                    <option value="matching">Соотнесение карточек</option> <!-- Новый тип вопроса -->
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
        const passingScore = document.getElementById('passing-score').value;
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
            } else {
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

        console.log(testId);

        let url = 'http://127.0.0.1:8000/tests/create_or_save_test';
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
