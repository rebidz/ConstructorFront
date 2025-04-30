// document.addEventListener('DOMContentLoaded', async () => { // Добавляем async
//     let test_data = null; // Глобальная переменная для хранения данных
//
//     async function getTestData() {
//         const urlParams = new URLSearchParams(window.location.search);
//         const testId = urlParams.get('test_id');
//         console.log("ID теста:", testId);
//
//         try {
//             const response = await fetch(`http://127.0.0.1:8000/tests/get_test/${testId}`, {
//                 method: "GET",
//                 headers: {
//                     "Content-Type": "application/x-www-form-urlencoded",
//                 },
//             });
//
//             const data = await response.json();
//             console.log("Ответ от сервера:", data);
//
//             if (!data.title) {
//                 throw new Error(data.detail || "Тест не найден");
//             }
//
//             test_data = data; // Сохраняем данные в глобальную переменную
//             console.log("Данные сохранены в globalTestData:", test_data);
//         } catch (error) {
//             console.error("Ошибка:", error);
//             alert("Ошибка загрузки теста: " + error.message);
//         }
//     }
//
//     // Переносим основной код в отдельную async функцию
//     async function init() {
//         await getTestData(); // Ждем загрузки данных
//
//         console.log('Данные загружены:', test_data);
//
//         // Только теперь работаем с данными
//         if (test_data !== null) {
//             await loadTest(test_data); // Ждем загрузки теста
//             console.log('Тест успешно загружен');
//         }
//
//         // Остальной код инициализации
//         const formQuestions = document.getElementById('form-questions');
//         const addQuestionButton = document.getElementById('add-question');
//         let questionCount = 0; // Счетчик для уникальных идентификаторов вопросов
//
//         // Генерация HTML для вариантов ответа
//         const createOptionsHTML = (type, questionId) => {
//             if (type === 'text') {
//                 return `
//                     <div class="text-answer-container">
//                         <textarea class="text-answer" placeholder="Введите развернутый ответ"></textarea>
//                     </div>`;
//             }
//             const inputType = type === 'single' ? 'radio' : 'checkbox';
//             return `
//                 <div class="option">
//                     <input type="${inputType}" name="correct-answer-${questionId}" class="correct-answer" />
//                     <span contenteditable="true">Вариант ответа 1</span>
//                 </div>
//                 <div class="option">
//                     <input type="${inputType}" name="correct-answer-${questionId}" class="correct-answer" />
//                     <span contenteditable="true">Вариант ответа 2</span>
//                 </div>
//                 <div class="option">
//                     <input type="${inputType}" name="correct-answer-${questionId}" class="correct-answer" />
//                     <span contenteditable="true">Вариант ответа 3</span>
//                 </div>
//                 <div class="option">
//                     <input type="${inputType}" name="correct-answer-${questionId}" class="correct-answer" />
//                     <span contenteditable="true">Вариант ответа 4</span>
//                 </div>
//                 <button class="add-option-btn">Добавить вариант ответа</button>`;
//         };
//
//         // Добавление нового варианта ответа
//         const addOption = (type, container, questionId) => {
//             const inputType = type === 'single' ? 'radio' : 'checkbox';
//             const newOption = document.createElement('div');
//             newOption.className = 'option';
//             newOption.innerHTML = `
//                 <input type="${inputType}" name="correct-answer-${questionId}" class="correct-answer" />
//                 <span contenteditable="true">Вариант ответа</span>`;
//             container.insertBefore(newOption, container.querySelector('.add-option-btn'));
//             newOption.querySelector('span').focus();
//         };
//
//         // Инициализация управления вопросом (удаление, копирование, добавление опций)
//         const initializeQuestionControls = (question) => {
//             const selectType = question.querySelector('.question-type');
//             const optionsContainer = question.querySelector('.options');
//             const questionId = questionCount; // Используем текущий счетчик для ID вопроса
//
//             // Обновление вариантов ответа при смене типа
//             selectType.addEventListener('change', () => {
//                 const type = selectType.value;
//                 optionsContainer.innerHTML = createOptionsHTML(type, questionId);
//                 attachAddOptionEvent(type, optionsContainer, questionId);
//             });
//
//             // Удаление вопроса
//             question.querySelector('.delete-question').addEventListener('click', () => question.remove());
//
//             // Копирование вопроса
//             question.querySelector('.copy-question').addEventListener('click', () => {
//                 questionCount++; // Увеличиваем счетчик для нового вопроса
//                 const clonedQuestion = question.cloneNode(true);
//                 const clonedSelectType = clonedQuestion.querySelector('.question-type');
//                 clonedSelectType.value = selectType.value; // Сохраняем тип вопроса
//                 clonedQuestion.querySelectorAll('.option').forEach(option => {
//                     // Обновляем name для каждого input в скопированном вопросе
//                     option.querySelector('input').name = `correct-answer-${questionCount}`;
//                 });
//                 initializeQuestionControls(clonedQuestion);
//                 formQuestions.insertBefore(clonedQuestion, question.nextSibling);
//             });
//
//             // Кнопка "Добавить вариант ответа"
//             attachAddOptionEvent(selectType.value, optionsContainer, questionId);
//         };
//
//         // Добавление обработчика на кнопку "Добавить вариант ответа"
//         const attachAddOptionEvent = (type, container, questionId) => {
//             const addOptionButton = container.querySelector('.add-option-btn');
//             if (addOptionButton) {
//                 addOptionButton.addEventListener('click', () => addOption(type, container, questionId));
//             }
//         };
//
//         // Добавление нового вопроса
//         const addQuestion = () => {
//             questionCount++; // Увеличиваем счетчик при добавлении нового вопроса
//             const questionHTML = `
//                 <div class="question">
//                     <div class="question-title" contenteditable="true">Новый вопрос</div>
//                     <select class="question-type">
//                         <option value="single">Один вариант ответа</option>
//                         <option value="multiple">Несколько вариантов ответа</option>
//                         <option value="text">Развернутый ответ</option>
//                     </select>
//                     <div class="options">${createOptionsHTML('single', questionCount)}</div>
//                     <div class="question-controls">
//                         <button class="copy-question"><img src="/src/static/img/copy-2.svg"></button>
//                         <button class="delete-question"><img src="/src/static/img/mycop-2.svg"></button>
//                     </div>
//                 </div>`;
//             formQuestions.insertAdjacentHTML('beforeend', questionHTML);
//             const question = formQuestions.lastElementChild;
//             initializeQuestionControls(question);
//             question.querySelector('.question-title').focus();
//         };
//
//         addQuestionButton.addEventListener('click', addQuestion);
//
//         // Сохранение теста
//         const saveTest = () => {
//             const testTitle = document.querySelector('.form-header h1').textContent.trim();
//             const testDescription = document.querySelector('.form-header p').textContent.trim();
//             const questions = Array.from(document.querySelectorAll('.question')).map(question => {
//                 const title = question.querySelector('.question-title').textContent.trim();
//                 const questionType = question.querySelector('.question-type').value;
//                 let options = [];
//                 let answerText = '';
//
//                 if (questionType === 'text') {
//                     // Для текстового ответа сохраняем развернутый текст
//                     answerText = question.querySelector('.text-answer')?.value?.trim() || '';
//                     options = [answerText]
//                 } else {
//                     // Для обычных вариантов ответа собираем данные
//                     options = Array.from(question.querySelectorAll('.option')).map(option => ({
//                         text: option.querySelector('span').textContent.trim(),
//                         is_correct: option.querySelector('input').checked
//                     }));
//                 }
//                 return {title, question_type: questionType, options, answer_text: answerText};
//             });
//
//             let testData = {
//                 title: testTitle,
//                 description: testDescription,
//                 questions: questions
//             };
//
//             if (test_data !== null) {
//                 testData['id'] = test_data['id']
//             }
//
//             fetch('api/tests/', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'X-CSRFToken': getCSRFToken()
//                 },
//                 body: JSON.stringify(testData)
//             })
//                 .then(response => {
//                     if (response.ok) {
//                         alert('Тест успешно сохранен!');
//                         window.location.href = '/editor/menu_konst/';
//                         return response.json();
//                     } else {
//                         throw new Error('Ошибка при сохранении теста.');
//                     }
//                 })
//                 .catch(error => {
//                     alert('Ошибка сохранения теста.');
//                 });
//         };
//
//         // Функция для рендеринга вопросов с учетом функционала
//         async function renderTests (testData) {
//             console.log(testData);
//             const questionContainer = document.querySelector("#form-questions");
//             questionContainer.innerHTML = ""; // Очистка контейнера вопросов
//             testData.questions.forEach(question => {
//                 console.log(question);
//                 const questionElement = document.createElement('div');
//                 questionElement.className = 'question';
//                 questionElement.dataset.questionId = question.id; // Привязываем ID к вопросу
//
//                 // Вставляем название вопроса
//                 const questionTitle = document.createElement('div');
//                 questionTitle.className = 'question-title';
//                 questionTitle.contentEditable = true;
//                 questionTitle.textContent = question.title;
//
//                 // Создаем элемент для выбора типа вопроса
//                 const selectType = document.createElement('select');
//                 selectType.className = 'question-type';
//                 const optionSingle = document.createElement('option');
//                 optionSingle.value = 'single';
//                 optionSingle.textContent = 'Один вариант ответа';
//                 const optionMultiple = document.createElement('option');
//                 optionMultiple.value = 'multiple';
//                 optionMultiple.textContent = 'Несколько вариантов ответа';
//                 const optionText = document.createElement('option');
//                 optionText.value = 'text';
//                 optionText.textContent = 'Развернутый ответ';
//
//                 // Добавляем соответствующий тип
//                 if (question.question_type === 'single') {
//                     optionSingle.selected = true;
//                 } else if (question.question_type === 'multiple') {
//                     optionMultiple.selected = true;
//                 } else if (question.question_type === 'text') {
//                     optionText.selected = true;
//                 }
//
//                 selectType.appendChild(optionSingle);
//                 selectType.appendChild(optionMultiple);
//                 selectType.appendChild(optionText);
//
//                 // Добавляем вариант для вопросов типа 'single' или 'multiple'
//                 const optionsContainer = document.createElement('div');
//                 optionsContainer.className = 'options';
//
//                 if (question.question_type === 'text') {
//                     // Если тип вопроса 'text', создаем поле для текстового ответа
//                     const textAnswerContainer = document.createElement('div');
//                     textAnswerContainer.className = 'text-answer-container';
//                     const textArea = document.createElement('textarea');
//                     textArea.placeholder = 'Введите развернутый ответ';
//                     textArea.value = question.options[0]?.text || ''; // Текст из первого варианта
//                     textArea.className = 'text-answer'
//                     textAnswerContainer.appendChild(textArea);
//                     optionsContainer.appendChild(textAnswerContainer);
//                 } else {
//                     // Для вопросов 'single' и 'multiple' добавляем варианты
//                     question.options.forEach((option, index) => {
//                         const optionElement = document.createElement('div');
//                         optionElement.className = 'option';
//                         const input = document.createElement('input');
//                         input.type = question.question_type === 'single' ? 'radio' : 'checkbox';
//                         input.name = `question-${question.id}`;
//                         input.checked = option.is_correct;
//                         const span = document.createElement('span');
//                         span.contentEditable = true;
//                         span.textContent = option.text;
//                         optionElement.appendChild(input);
//                         optionElement.appendChild(span);
//                         optionsContainer.appendChild(optionElement);
//                     });
//
//                     // Добавляем кнопку для добавления нового варианта
//                     const addOptionButton = document.createElement('button');
//                     addOptionButton.className = 'add-option-btn';
//                     addOptionButton.textContent = 'Добавить вариант ответа';
//                     optionsContainer.appendChild(addOptionButton);
//                 }
//
//                 // Добавляем кнопки для копирования и удаления вопроса
//                 const questionControls = document.createElement('div');
//                 questionControls.className = 'question-controls';
//
//                 const copyButton = document.createElement('button');
//                 copyButton.className = 'copy-question';
//                 copyButton.innerHTML = '<img src="/src/static/img/copy.svg" alt="Копировать вопрос">';
//
//                 const deleteButton = document.createElement('button');
//                 deleteButton.className = 'delete-question';
//                 deleteButton.innerHTML = '<img src="/src/static/img/mycop.svg" alt="Удалить вопрос">';
//
//                 questionControls.appendChild(copyButton);
//                 questionControls.appendChild(deleteButton);
//
//                 // Добавляем все элементы к вопросу
//                 questionElement.appendChild(questionTitle);
//                 questionElement.appendChild(selectType);
//                 questionElement.appendChild(optionsContainer);
//                 questionElement.appendChild(questionControls);
//
//                 // Добавляем вопрос в контейнер
//                 questionContainer.appendChild(questionElement);
//
//                 // Инициализация функционала вопроса (удаление, копирование, добавление опций)
//                 initializeQuestionControls(questionElement);
//             });
//         }
//
//         async function loadTest(testData) {
//             console.log(123213213213213213)
//             console.log(testData);
//             try {
//                 // Если данные теста получены, заполняем форму
//                 if (testData) {
//                     document.querySelector("#test-title").innerText = testData.title;
//                     document.querySelector("#test-description").innerText = testData.description;
//                     const questionContainer = document.querySelector("#form-questions");
//                     questionContainer.innerHTML = ""; // Очистка контейнера вопросов
//                     await renderTests(testData);
//                 }
//             } catch (error) {
//                 console.error("Ошибка загрузки данных теста:", error);
//                 alert("Не удалось загрузить данные теста. Попробуйте позже.");
//             }
//         }
//         // Открытие теста существующего
//         if (test_data !== null) loadTest(test_data)
//
//         // Привязка функции к кнопке "Сохранить"
//         document.querySelector('.hc-button').addEventListener('click', saveTest);
//
//         // Функция для получения CSRF-токена
//         const getCSRFToken = () => {
//             const cookieValue = document.cookie
//                 .split('; ')
//                 .find(row => row.startsWith('csrftoken='))
//                 ?.split('=')[1];
//             return cookieValue || '';
//         };
//     }
//
//     // Запускаем инициализацию
//     init().catch(error => {
//         console.error('Ошибка инициализации:', error);
//         alert('Произошла ошибка при загрузке страницы');
//     });
// });



document.addEventListener('DOMContentLoaded', async () => {
    let test_data = null;
    let questionCount = 0;
    const formQuestions = document.getElementById('form-questions');
    const addQuestionButton = document.getElementById('add-question');

    const createOptionsHTML = (type, questionId) => {
        if (type === 'text') {
            return `<div class="text-answer-container">
                      <textarea class="text-answer" placeholder="Введите развернутый ответ"></textarea>
                    </div>`;
        }
        const inputType = type === 'single' ? 'radio' : 'checkbox';
        return `<div class="option">
                  <input type="${inputType}" name="correct-answer-${questionId}" class="correct-answer" />
                  <span contenteditable="true">Вариант ответа 1</span>
                </div>
                <div class="option">
                  <input type="${inputType}" name="correct-answer-${questionId}" class="correct-answer" />
                  <span contenteditable="true">Вариант ответа 2</span>
                </div>
                <div class="option">
                  <input type="${inputType}" name="correct-answer-${questionId}" class="correct-answer" />
                  <span contenteditable="true">Вариант ответа 3</span>
                </div>
                <div class="option">
                  <input type="${inputType}" name="correct-answer-${questionId}" class="correct-answer" />
                  <span contenteditable="true">Вариант ответа 4</span>
                </div>
                <button class="add-option-btn">Добавить вариант ответа</button>`;
    };

    const addOption = (type, container, questionId) => {
        const inputType = type === 'single' ? 'radio' : 'checkbox';
        const newOption = document.createElement('div');
        newOption.className = 'option';
        newOption.innerHTML = `
            <input type="${inputType}" name="correct-answer-${questionId}" class="correct-answer" />
            <span contenteditable="true">Новый вариант ответа</span>`;
        container.insertBefore(newOption, container.querySelector('.add-option-btn'));
        newOption.querySelector('span').focus();
    };

    const attachAddOptionEvent = (type, container, questionId) => {
        const addOptionButton = container.querySelector('.add-option-btn');
        if (addOptionButton) {
            addOptionButton.addEventListener('click', () => addOption(type, container, questionId));
        }
    };

    const initializeQuestionControls = (question) => {
        const selectType = question.querySelector('.question-type');
        const optionsContainer = question.querySelector('.options');
        const questionId = question.dataset.questionId || questionCount;

        selectType.addEventListener('change', () => {
            const type = selectType.value;
            optionsContainer.innerHTML = createOptionsHTML(type, questionId);
            attachAddOptionEvent(type, optionsContainer, questionId);
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

    async function renderTests(testData) {
        const questionContainer = document.querySelector("#form-questions");
        questionContainer.innerHTML = "";

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
                    optionElement.appendChild(input);
                    optionElement.appendChild(span);
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

            questionControls.appendChild(copyButton);
            questionControls.appendChild(deleteButton);

            questionElement.appendChild(questionTitle);
            questionElement.appendChild(selectType);
            questionElement.appendChild(optionsContainer);
            questionElement.appendChild(questionControls);

            questionContainer.appendChild(questionElement);
            initializeQuestionControls(questionElement);
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
                </select>
                <div class="options">${createOptionsHTML('single', questionCount)}</div>
                <div class="question-controls">
                    <button class="copy-question"><img src="/src/static/img/copy-2.svg"></button>
                    <button class="delete-question"><img src="/src/static/img/mycop-2.svg"></button>
                </div>
            </div>`;
        formQuestions.insertAdjacentHTML('beforeend', questionHTML);
        initializeQuestionControls(formQuestions.lastElementChild);
    };

    function getJwtTokenFromCookies() {
      const cookieString = document.cookie;
      const cookies = cookieString.split('; ');

      for (const cookie of cookies) {
        const [name, value] = cookie.split('=');
        if (name === 'access_token' || name === 'jwt' || name === 'token') { // Подставьте правильное имя вашей куки
          return value;
        }
      }
      return null;
    }

    function decodeJwtToken(token) {
      try {
        // JWT состоит из 3 частей, разделенных точками: header.payload.signature
        const base64Url = token.split('.')[1];

        // Заменяем символы, специфичные для base64url
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

        // Декодируем base64
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map(c => '%' + ('00' + c.charCodeAt(0).toString(16).slice(-2))
            .join('')
        ));

        return JSON.parse(jsonPayload);
      } catch (error) {
        console.error('Ошибка декодирования JWT:', error);
        return null;
      }
    }

    function getUserIdFromJwt() {
      // 1. Получаем токен из куки
      const token = getJwtTokenFromCookies();
      if (!token) {
        console.error('JWT токен не найден в куках');
        return null;
      }

      // 2. Декодируем токен
      const decodedToken = decodeJwtToken(token);
      if (!decodedToken) {
        console.error('Не удалось декодировать JWT токен');
        return null;
      }

      // 3. Извлекаем user_id
      const userId = decodedToken.id; // В вашем примере это поле "id"
      if (!userId) {
        console.error('Поле id не найдено в JWT токене');
        return null;
      }

      return userId;
    }


    const saveTest = () => {
        const testTitle = document.querySelector('.form-header h1').textContent.trim();
        const testDescription = document.querySelector('.form-header p').textContent.trim();
        const questions = Array.from(document.querySelectorAll('.question')).map(question => {
            const scores = 10;
            const title = question.querySelector('.question-title').textContent.trim();
            const questionType = question.querySelector('.question-type').value;
            let options = [];
            let answerText = '';

            if (questionType === 'text') {
                // Для текстового ответа сохраняем развернутый текст
                answerText = question.querySelector('.text-answer')?.value?.trim() || '';
                options = [answerText]
            } else {
                // Для обычных вариантов ответа собираем данные
                options = Array.from(question.querySelectorAll('.option')).map(option => ({
                    text: option.querySelector('span').textContent.trim(),
                    is_correct: option.querySelector('input').checked
                }));
            }
            return {title, question_type: questionType, options, answer_text: answerText, scores};
        });

        const userId = 'defd7a5a-4f70-4970-9db5-19d7580d8e8b';

        let testData = {
            title: testTitle,
            description: testDescription,
            questions: questions,
            duration: "14:18:03",
            passing_score: 20,
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
            url += `?id=${testId}`;
        }

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
                    // console.log(response.json())
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

    async function init() {
        await getTestData();
        if (test_data) await loadTest(test_data);

        addQuestionButton.addEventListener('click', addQuestion);
        document.querySelector('.hc-button').addEventListener('click', saveTest);
    }

    init().catch(error => {
        console.error("Ошибка инициализации:", error);
        alert("Ошибка при загрузке страницы");
    });
});
